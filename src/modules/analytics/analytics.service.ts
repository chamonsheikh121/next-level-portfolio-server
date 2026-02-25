import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { TrackPageViewDto } from './dto/track-page-view.dto';
import { DateRange } from './dto/dashboard-query.dto';
import { v4 as uuidv4 } from 'uuid';
import * as geoip from 'geoip-lite';

@Injectable()
export class AnalyticsService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Get geo-location from IP address with fallback
   */
  private async getGeoLocation(ipAddress: string | null): Promise<{
    country: string | null;
    region: string | null;
    city: string | null;
  }> {
    if (!ipAddress || this.isLocalhost(ipAddress)) {
      return { country: null, region: null, city: null };
    }

    // Try geoip-lite first (offline, fast)
    const geoLocal = geoip.lookup(ipAddress);
    if (geoLocal) {
      return {
        country: geoLocal.country || null,
        region: geoLocal.region || null,
        city: geoLocal.city || null,
      };
    }

    // Fallback to ip-api.com (free, no API key needed)
    try {
      const response = await fetch(
        `http://ip-api.com/json/${ipAddress}?fields=country,regionName,city,countryCode`,
      );
      if (response.ok) {
        const data = await response.json();
        if (data.status !== 'fail') {
          Logger.log(`✅ Geo-location from API: ${ipAddress} → ${data.countryCode}`);
          return {
            country: data.countryCode || null,
            region: data.regionName || null,
            city: data.city || null,
          };
        }
      }
    } catch (error) {
      Logger.warn(`Failed to fetch geo-location from API: ${error.message}`);
    }

    return { country: null, region: null, city: null };
  }

  /**
   * Track page view and manage visitor
   */
  async trackPageView(
    trackPageViewDto: TrackPageViewDto,
    visitorId: string | null,
    userAgent: string | null,
    ipAddress: string | null,
  ): Promise<{ visitorId: string; isNewVisitor: boolean }> {
    try {
      let currentVisitorId = visitorId;
      let isNewVisitor = false;

      // Step 1: Check if visitor exists
      if (!currentVisitorId) {
        // Generate new visitor ID
        currentVisitorId = uuidv4();
        isNewVisitor = true;

        // Get geo-location data from IP address (with fallback to API)
        const geo = await this.getGeoLocation(ipAddress);

        if (this.isLocalhost(ipAddress || '')) {
          Logger.warn(
            `Localhost IP detected (${ipAddress}). Geo-location skipped. Use public IP in production.`,
          );
        } else {
          Logger.log(`New visitor from IP: ${ipAddress}, Geo:`, geo);
        }

        // Create new visitor
        await this.prisma.client.visitor.create({
          data: {
            id: currentVisitorId,
            userAgent,
            ipAddress,
            country: geo?.country || null,
            region: geo?.region || null,
            city: geo?.city || null,
          },
        });
      } else {
        // Update existing visitor's lastVisitAt
        const existingVisitor = await this.prisma.client.visitor.findUnique({
          where: { id: currentVisitorId },
        });

        if (existingVisitor) {
          // Get current geo-location (with fallback to API)
          const geo = await this.getGeoLocation(ipAddress);

          // Update visitor - update geo-location if it's currently null
          await this.prisma.client.visitor.update({
            where: { id: currentVisitorId },
            data: {
              lastVisitAt: new Date(),
              // Update geo-location only if it was null before
              ...(!existingVisitor.country &&
                geo && {
                  ipAddress,
                  country: geo.country || null,
                  region: geo.region || null,
                  city: geo.city || null,
                }),
            },
          });

          // Log geo-location update
          if (!existingVisitor.country && geo) {
            Logger.log(
              `🌍 Updated visitor geo-location: ${currentVisitorId}`,
              `IP: ${ipAddress}, Country: ${geo.country}`,
            );
          }
        } else {
          // Cookie exists but visitor not in DB, create new one
          const geo = await this.getGeoLocation(ipAddress);

          await this.prisma.client.visitor.create({
            data: {
              id: currentVisitorId,
              userAgent,
              ipAddress,
              country: geo?.country || null,
              region: geo?.region || null,
              city: geo?.city || null,
            },
          });
          isNewVisitor = true;
        }
      }

      // Step 2: Find or create page
      const page = await this.prisma.client.page.upsert({
        where: { slug: trackPageViewDto.slug },
        update: trackPageViewDto.title ? { title: trackPageViewDto.title } : {},
        create: {
          slug: trackPageViewDto.slug,
          title: trackPageViewDto.title,
        },
      });

      // Step 3: Create page view record
      await this.prisma.client.pageView.create({
        data: {
          visitorId: currentVisitorId,
          pageId: page.id,
        },
      });

      return { visitorId: currentVisitorId, isNewVisitor };
    } catch (error) {
      throw new InternalServerErrorException(`Failed to track page view: ${error.message}`);
    }
  }

  /**
   * Get total website visitor count
   */
  async getTotalVisitors(): Promise<number> {
    try {
      return await this.prisma.client.visitor.count();
    } catch (error) {
      throw new InternalServerErrorException(`Failed to get total visitors: ${error.message}`);
    }
  }

  /**
   * Get total page views across all pages
   */
  async getTotalPageViews(): Promise<number> {
    try {
      return await this.prisma.client.pageView.count();
    } catch (error) {
      throw new InternalServerErrorException(`Failed to get total page views: ${error.message}`);
    }
  }

  /**
   * Get analytics for a specific page
   */
  async getPageAnalytics(slug: string) {
    try {
      const page = await this.prisma.client.page.findUnique({
        where: { slug },
        include: {
          _count: {
            select: { pageViews: true },
          },
          pageViews: {
            select: {
              visitorId: true,
            },
          },
        },
      });

      if (!page) {
        throw new NotFoundException(`Page with slug "${slug}" not found`);
      }

      // Calculate unique visitors for this page
      const uniqueVisitors = new Set(page.pageViews.map((pv) => pv.visitorId)).size;

      return {
        slug: page.slug,
        title: page.title,
        totalViews: page._count.pageViews,
        uniqueVisitors,
        createdAt: page.createdAt,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(`Failed to get page analytics: ${error.message}`);
    }
  }

  /**
   * Get analytics for all pages
   */
  async getAllPagesAnalytics() {
    try {
      const pages = await this.prisma.client.page.findMany({
        include: {
          _count: {
            select: { pageViews: true },
          },
          pageViews: {
            select: {
              visitorId: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      return pages.map((page) => ({
        id: page.id,
        slug: page.slug,
        title: page.title,
        totalViews: page._count.pageViews,
        uniqueVisitors: new Set(page.pageViews.map((pv) => pv.visitorId)).size,
        createdAt: page.createdAt,
      }));
    } catch (error) {
      throw new InternalServerErrorException(`Failed to get all pages analytics: ${error.message}`);
    }
  }

  /**
   * Get returning visitors count (visitors who came back)
   */
  async getReturningVisitors(): Promise<number> {
    try {
      const visitors = await this.prisma.client.visitor.findMany({
        include: {
          _count: {
            select: { pageViews: true },
          },
        },
      });

      // Returning visitor = has more than 1 page view
      return visitors.filter((v) => v._count.pageViews > 1).length;
    } catch (error) {
      throw new InternalServerErrorException(`Failed to get returning visitors: ${error.message}`);
    }
  }

  /**
   * Helper: Check if IP is localhost/private
   */
  private isLocalhost(ip: string): boolean {
    if (!ip) return true;
    return (
      ip === '127.0.0.1' ||
      ip === '::1' ||
      ip === 'localhost' ||
      ip.startsWith('192.168.') ||
      ip.startsWith('10.') ||
      ip.startsWith('172.16.') ||
      ip.startsWith('172.17.') ||
      ip.startsWith('172.18.') ||
      ip.startsWith('172.19.') ||
      ip.startsWith('172.20.') ||
      ip.startsWith('172.21.') ||
      ip.startsWith('172.22.') ||
      ip.startsWith('172.23.') ||
      ip.startsWith('172.24.') ||
      ip.startsWith('172.25.') ||
      ip.startsWith('172.26.') ||
      ip.startsWith('172.27.') ||
      ip.startsWith('172.28.') ||
      ip.startsWith('172.29.') ||
      ip.startsWith('172.30.') ||
      ip.startsWith('172.31.')
    );
  }

  /**
   * Helper: Get date from date range
   */
  private getDateFromRange(dateRange: DateRange): Date {
    const now = new Date();
    const date = new Date();

    switch (dateRange) {
      case DateRange.SEVEN_DAYS:
        date.setDate(now.getDate() - 7);
        break;
      case DateRange.TEN_DAYS:
        date.setDate(now.getDate() - 10);
        break;
      case DateRange.THIRTY_DAYS:
        date.setDate(now.getDate() - 30);
        break;
      case DateRange.ONE_YEAR:
        date.setFullYear(now.getFullYear() - 1);
        break;
      default:
        date.setDate(now.getDate() - 7);
    }

    return date;
  }

  /**
   * Get dashboard summary with comprehensive analytics
   */
  async getDashboardSummary(dateRange: DateRange = DateRange.SEVEN_DAYS) {
    try {
      const startDate = this.getDateFromRange(dateRange);
      const isYearlyView = dateRange === DateRange.ONE_YEAR;

      // Get total counts (all time)
      const [
        totalVisitors,
        totalPageViews,
        totalProjects,
        totalBlogs,
        totalReviews,
        totalServices,
        totalFaqs,
        totalNpmPackages,
        totalHireRequests,
        totalMessages,
        totalUsers,
      ] = await Promise.all([
        this.prisma.client.visitor.count(),
        this.prisma.client.pageView.count(),
        this.prisma.client.project.count(),
        this.prisma.client.blog.count(),
        this.prisma.client.review.count(),
        this.prisma.client.service.count(),
        this.prisma.client.faq.count(),
        this.prisma.client.npmPackage.count(),
        this.prisma.client.hireRequest.count(),
        this.prisma.client.user_message.count(),
        this.prisma.client.user.count(),
      ]);

      // Get visitors time series data (date-wise)
      const visitorsTimeSeries = await this.prisma.client.visitor.findMany({
        where: {
          firstVisitAt: {
            gte: startDate,
          },
        },
        select: {
          id: true,
          firstVisitAt: true,
        },
        orderBy: {
          firstVisitAt: 'asc',
        },
      });

      // Get page views time series data
      const pageViewsTimeSeries = await this.prisma.client.pageView.findMany({
        where: {
          viewedAt: {
            gte: startDate,
          },
        },
        select: {
          id: true,
          viewedAt: true,
          visitorId: true,
        },
        orderBy: {
          viewedAt: 'asc',
        },
      });

      // Group by date or month based on date range
      let chartData;
      if (isYearlyView) {
        // Group by month for 1 year view
        chartData = this.groupByMonth(
          visitorsTimeSeries,
          pageViewsTimeSeries,
          startDate,
          new Date(),
        );
      } else {
        // Group by day for other ranges
        const visitorsByDate = this.groupByDate(visitorsTimeSeries, 'firstVisitAt');
        const pageViewsByDate = this.groupByDate(pageViewsTimeSeries, 'viewedAt');
        const uniqueVisitorsByDate = this.groupUniqueVisitorsByDate(pageViewsTimeSeries);

        chartData = this.mergeTimeSeriesData(
          visitorsByDate,
          pageViewsByDate,
          uniqueVisitorsByDate,
          startDate,
          new Date(),
        );
      }

      // Get top pages with views in selected date range
      const topPages = await this.getTopPages(startDate);

      // Get country-wise visitor distribution
      const countryDistribution = await this.getCountryDistribution(startDate);

      return {
        // Total counts (all time)
        totalCounts: {
          visitors: totalVisitors,
          pageViews: totalPageViews,
          projects: totalProjects,
          blogs: totalBlogs,
          reviews: totalReviews,
          services: totalServices,
          faqs: totalFaqs,
          npmPackages: totalNpmPackages,
          hireRequests: totalHireRequests,
          messages: totalMessages,
          users: totalUsers,
        },
        // Time series data for selected range
        chartData,
        // Top pages for selected range
        topPages,
        // Country distribution for selected range
        countryDistribution,
        // Applied filter
        dateRange,
      };
    } catch (error) {
      throw new InternalServerErrorException(`Failed to get dashboard summary: ${error.message}`);
    }
  }

  /**
   * Helper: Group data by date
   */
  private groupByDate(data: any[], dateField: string): Map<string, number> {
    const grouped = new Map<string, number>();

    data.forEach((item) => {
      const date = new Date(item[dateField]).toISOString().split('T')[0];
      grouped.set(date, (grouped.get(date) || 0) + 1);
    });

    return grouped;
  }

  /**
   * Helper: Group unique visitors by date
   */
  private groupUniqueVisitorsByDate(pageViews: any[]): Map<string, number> {
    const grouped = new Map<string, Set<string>>();

    pageViews.forEach((pv) => {
      const date = new Date(pv.viewedAt).toISOString().split('T')[0];
      if (!grouped.has(date)) {
        grouped.set(date, new Set());
      }
      grouped.get(date)!.add(pv.visitorId);
    });

    // Convert Set sizes to counts
    const result = new Map<string, number>();
    grouped.forEach((visitors, date) => {
      result.set(date, visitors.size);
    });

    return result;
  }

  /**
   * Helper: Group data by month (for yearly view)
   */
  private groupByMonth(visitors: any[], pageViews: any[], startDate: Date, endDate: Date) {
    const monthlyData = new Map<
      string,
      {
        newVisitors: number;
        totalViews: number;
        uniqueVisitors: Set<string>;
      }
    >();

    // Generate all months in the range
    const start = new Date(startDate);
    const end = new Date(endDate);
    const currentMonth = new Date(start.getFullYear(), start.getMonth(), 1);

    while (currentMonth <= end) {
      const monthKey = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}`;
      monthlyData.set(monthKey, {
        newVisitors: 0,
        totalViews: 0,
        uniqueVisitors: new Set(),
      });
      currentMonth.setMonth(currentMonth.getMonth() + 1);
    }

    // Group new visitors by month
    visitors.forEach((visitor) => {
      const date = new Date(visitor.firstVisitAt);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`; // YYYY-MM

      if (monthlyData.has(monthKey)) {
        monthlyData.get(monthKey)!.newVisitors++;
      }
    });

    // Group page views and unique visitors by month
    pageViews.forEach((pv) => {
      const date = new Date(pv.viewedAt);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

      if (monthlyData.has(monthKey)) {
        const monthData = monthlyData.get(monthKey)!;
        monthData.totalViews++;
        monthData.uniqueVisitors.add(pv.visitorId);
      }
    });

    // Convert to array and sort by month
    return Array.from(monthlyData.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([month, data]) => ({
        date: month, // YYYY-MM format
        newVisitors: data.newVisitors,
        totalViews: data.totalViews,
        uniqueVisitors: data.uniqueVisitors.size,
      }));
  }

  /**
   * Helper: Merge time series data for chart
   */
  private mergeTimeSeriesData(
    newVisitors: Map<string, number>,
    pageViews: Map<string, number>,
    uniqueVisitors: Map<string, number>,
    startDate: Date,
    endDate: Date,
  ) {
    // Generate all dates in the range
    const allDates: string[] = [];
    const currentDate = new Date(startDate);
    const end = new Date(endDate);

    while (currentDate <= end) {
      allDates.push(currentDate.toISOString().split('T')[0]);
      currentDate.setDate(currentDate.getDate() + 1);
    }

    const data = allDates.map((date) => ({
      date,
      newVisitors: newVisitors.get(date) || 0,
      totalViews: pageViews.get(date) || 0,
      uniqueVisitors: uniqueVisitors.get(date) || 0,
    }));

    return data;
  }

  /**
   * Helper: Get top pages by views
   */
  private async getTopPages(startDate: Date) {
    const pageViews = await this.prisma.client.pageView.findMany({
      where: {
        viewedAt: {
          gte: startDate,
        },
      },
      include: {
        page: true,
      },
    });

    // Group by page
    const pageStats = new Map<number, { slug: string; title: string; views: number }>();

    pageViews.forEach((pv) => {
      const pageId = pv.page.id;
      if (!pageStats.has(pageId)) {
        pageStats.set(pageId, {
          slug: pv.page.slug,
          title: pv.page.title || pv.page.slug,
          views: 0,
        });
      }
      pageStats.get(pageId)!.views++;
    });

    // Convert to array and sort by views
    return Array.from(pageStats.values())
      .sort((a, b) => b.views - a.views)
      .slice(0, 10); // Top 10 pages
  }

  /**
   * Helper: Get country-wise visitor distribution with city and region
   */
  private async getCountryDistribution(startDate: Date) {
    const visitors = await this.prisma.client.visitor.findMany({
      where: {
        firstVisitAt: {
          gte: startDate,
        },
        country: {
          not: null,
        },
      },
      select: {
        country: true,
        region: true,
        city: true,
      },
    });

    // Group by country + region + city
    const locationStats = new Map<
      string,
      { country: string; region: string | null; city: string | null; count: number }
    >();

    visitors.forEach((visitor) => {
      if (visitor.country) {
        // Create unique key for grouping
        const key = `${visitor.country}|${visitor.region || 'unknown'}|${visitor.city || 'unknown'}`;

        if (!locationStats.has(key)) {
          locationStats.set(key, {
            country: visitor.country,
            region: visitor.region,
            city: visitor.city,
            count: 0,
          });
        }

        locationStats.get(key)!.count++;
      }
    });

    // Convert to array and sort by count
    return Array.from(locationStats.values())
      .map((stats) => ({
        country: stats.country,
        region: stats.region || null,
        city: stats.city || null,
        visitors: stats.count,
      }))
      .sort((a, b) => b.visitors - a.visitors);
  }
}
