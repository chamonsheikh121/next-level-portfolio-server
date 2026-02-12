import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Req,
  Res,
  UseGuards,
  Ip,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { AnalyticsService } from './analytics.service';
import { TrackPageViewDto } from './dto/track-page-view.dto';
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
    @Ip() ip: string,
  ) {
    // Get visitor ID from cookie
    const visitorId = req.cookies?.visitor_id || null;

    // Get user agent
    const userAgent = req.headers['user-agent'] || null;

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
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 365 * 24 * 60 * 60 * 1000, // 1 year
        sameSite: 'lax',
      });
    }

    return {
      success: true,
      message: 'Page view tracked successfully',
      isNewVisitor: result.isNewVisitor,
    };
  }

  @Get('dashboard')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get complete dashboard analytics' })
  @ApiResponse({
    status: 200,
    description: 'Dashboard analytics retrieved successfully',
    schema: {
      example: {
        totalVisitors: 150,
        newVisitors: 100,
        returningVisitors: 50,
        totalPageViews: 450,
        pages: [
          {
            id: 1,
            slug: '/projects',
            title: 'Projects',
            totalViews: 120,
            uniqueVisitors: 80,
            createdAt: '2026-02-12T10:00:00.000Z',
          },
        ],
      },
    },
  })
  getDashboard() {
    return this.analyticsService.getDashboardSummary();
  }

  @Get('visitors/total')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get total visitor count' })
  @ApiResponse({
    status: 200,
    description: 'Total visitors count',
    schema: {
      example: {
        totalVisitors: 150,
      },
    },
  })
  async getTotalVisitors() {
    const totalVisitors = await this.analyticsService.getTotalVisitors();
    return { totalVisitors };
  }

  @Get('visitors/returning')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get returning visitors count' })
  @ApiResponse({
    status: 200,
    description: 'Returning visitors count',
    schema: {
      example: {
        returningVisitors: 50,
      },
    },
  })
  async getReturningVisitors() {
    const returningVisitors =
      await this.analyticsService.getReturningVisitors();
    return { returningVisitors };
  }

  @Get('pageviews/total')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get total page views count' })
  @ApiResponse({
    status: 200,
    description: 'Total page views count',
    schema: {
      example: {
        totalPageViews: 450,
      },
    },
  })
  async getTotalPageViews() {
    const totalPageViews = await this.analyticsService.getTotalPageViews();
    return { totalPageViews };
  }

  @Get('pages')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get analytics for all pages' })
  @ApiResponse({
    status: 200,
    description: 'All pages analytics retrieved successfully',
  })
  getAllPagesAnalytics() {
    return this.analyticsService.getAllPagesAnalytics();
  }

  @Get('pages/:slug')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get analytics for a specific page' })
  @ApiParam({ name: 'slug', description: 'Page slug', example: '/projects' })
  @ApiResponse({
    status: 200,
    description: 'Page analytics retrieved successfully',
    schema: {
      example: {
        slug: '/projects',
        title: 'Projects',
        totalViews: 120,
        uniqueVisitors: 80,
        createdAt: '2026-02-12T10:00:00.000Z',
      },
    },
  })
  getPageAnalytics(@Param('slug') slug: string) {
    return this.analyticsService.getPageAnalytics(slug);
  }
}
