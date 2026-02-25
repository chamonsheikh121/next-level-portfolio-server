import { Controller, Get, Post, Body, Query, Req, Res, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { AnalyticsService } from './analytics.service';
import { TrackPageViewDto } from './dto/track-page-view.dto';
import { DashboardQueryDto, DateRange } from './dto/dashboard-query.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { Public } from '../../common/decorators/public.decorator';

@ApiTags('analytics')
@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Post('track')
  @Public()
  @ApiOperation({ summary: 'Track page view (Public endpoint)' })
  @ApiResponse({
    status: 201,
    description: 'Page view tracked successfully',
    schema: {
      example: {
        success: true,
        message: 'Page view tracked successfully',
        isNewVisitor: true,
      },
    },
  })
  async trackPageView(
    @Body() trackPageViewDto: TrackPageViewDto,
    @Req() req: any,
    @Res({ passthrough: true }) res: any,
  ) {
    // Get visitor ID from cookie
    const visitorId = req.cookies?.visitor_id || null;

    // DEBUG: Log cookie status
    console.log('🍪 Cookie Check:', {
      hasCookie: !!visitorId,
      visitorId: visitorId,
      allCookies: req.cookies,
    });

    // Get user agent
    const userAgent = req.headers['user-agent'] || null;

    // Get IP address (handle Cloudflare, proxy, and load balancer scenarios)
    const ip =
      req.headers['cf-connecting-ip'] || // Cloudflare Tunnel/Proxy
      req.headers['x-real-ip'] || // Nginx proxy
      req.headers['x-forwarded-for']?.split(',')[0]?.trim() || // Standard proxy
      req.socket.remoteAddress || // Direct connection
      null;

    // DEBUG: Log IP detection
    console.log('🌍 IP Detection:', {
      'cf-connecting-ip': req.headers['cf-connecting-ip'],
      'x-real-ip': req.headers['x-real-ip'],
      'x-forwarded-for': req.headers['x-forwarded-for'],
      'socket.remoteAddress': req.socket.remoteAddress,
      'Final IP': ip,
    });

    // Track the page view
    const result = await this.analyticsService.trackPageView(
      trackPageViewDto,
      visitorId,
      userAgent,
      ip,
    );

    // Set cookie if new visitor (1 year expiry)
    if (result.isNewVisitor) {
      res.cookie('visitor_id', result.visitorId, {
        httpOnly: false, // Allow JavaScript access for testing
        secure: process.env.NODE_ENV === 'production',
        maxAge: 365 * 24 * 60 * 60 * 1000, // 1 year
        sameSite: 'lax',
        path: '/',
      });

      // DEBUG: Log new cookie set
      console.log('✅ New Cookie Set:', result.visitorId);
    } else {
      console.log('♻️ Existing Visitor:', visitorId);
    }

    return {
      success: true,
      message: 'Page view tracked successfully',
      isNewVisitor: result.isNewVisitor,
      visitorId: result.visitorId, // Return this for debugging
    };
  }

  @Get('dashboard')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get complete dashboard analytics with date filters' })
  @ApiQuery({
    name: 'dateRange',
    enum: DateRange,
    required: false,
    description: 'Date range filter (7d, 10d, 30d, 1y)',
    example: '7d',
  })
  @ApiResponse({
    status: 200,
    description: 'Dashboard analytics retrieved successfully',
    schema: {
      example: {
        totalCounts: {
          visitors: 150,
          pageViews: 450,
          projects: 25,
          blogs: 30,
          reviews: 40,
          services: 8,
          faqs: 15,
          npmPackages: 5,
          hireRequests: 12,
          messages: 35,
          users: 3,
        },
        chartData: [
          {
            date: '2026-02-19',
            newVisitors: 15,
            totalViews: 45,
            uniqueVisitors: 30,
          },
          {
            date: '2026-02-20',
            newVisitors: 20,
            totalViews: 60,
            uniqueVisitors: 35,
          },
        ],
        topPages: [
          {
            slug: '/projects',
            title: 'Projects',
            views: 120,
          },
          {
            slug: '/blog',
            title: 'Blog',
            views: 95,
          },
        ],
        countryDistribution: [
          {
            country: 'US',
            region: 'CA',
            city: 'Los Angeles',
            visitors: 50,
          },
          {
            country: 'BD',
            region: 'Dhaka',
            city: 'Dhaka',
            visitors: 30,
          },
          {
            country: 'IN',
            region: 'WB',
            city: 'Kolkata',
            visitors: 25,
          },
        ],
        dateRange: '7d',
      },
    },
  })
  getDashboard(@Query() query: DashboardQueryDto) {
    return this.analyticsService.getDashboardSummary(query.dateRange || DateRange.SEVEN_DAYS);
  }
}
