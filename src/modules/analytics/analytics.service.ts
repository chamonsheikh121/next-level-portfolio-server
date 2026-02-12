import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { TrackPageViewDto } from './dto/track-page-view.dto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AnalyticsService {
  constructor(private readonly prisma: PrismaService) {}

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

        // Create new visitor
        await this.prisma.client.visitor.create({
          data: {
            id: currentVisitorId,
            userAgent,
            ipAddress,
          },
        });
      } else {
        // Update existing visitor's lastVisitAt
        const existingVisitor = await this.prisma.client.visitor.findUnique({
          where: { id: currentVisitorId },
        });

        if (existingVisitor) {
          await this.prisma.client.visitor.update({
            where: { id: currentVisitorId },
            data: { lastVisitAt: new Date() },
          });
        } else {
          // Cookie exists but visitor not in DB, create new one
          await this.prisma.client.visitor.create({
            data: {
              id: currentVisitorId,
              userAgent,
              ipAddress,
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
      throw new InternalServerErrorException(
        `Failed to track page view: ${error.message}`,
      );
    }
  }

  /**
   * Get total website visitor count
   */
  async getTotalVisitors(): Promise<number> {
    try {
      return await this.prisma.client.visitor.count();
    } catch (error) {
      throw new InternalServerErrorException(
        `Failed to get total visitors: ${error.message}`,
      );
    }
  }

  /**
   * Get total page views across all pages
   */
  async getTotalPageViews(): Promise<number> {
    try {
      return await this.prisma.client.pageView.count();
    } catch (error) {
      throw new InternalServerErrorException(
        `Failed to get total page views: ${error.message}`,
      );
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
      const uniqueVisitors = new Set(
        page.pageViews.map((pv) => pv.visitorId),
      ).size;

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
      throw new InternalServerErrorException(
        `Failed to get page analytics: ${error.message}`,
      );
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
      throw new InternalServerErrorException(
        `Failed to get all pages analytics: ${error.message}`,
      );
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
      throw new InternalServerErrorException(
        `Failed to get returning visitors: ${error.message}`,
      );
    }
  }

  /**
   * Get dashboard summary
   */
  async getDashboardSummary() {
    try {
      const [
        totalVisitors,
        totalPageViews,
        returningVisitors,
        pagesAnalytics,
      ] = await Promise.all([
        this.getTotalVisitors(),
        this.getTotalPageViews(),
        this.getReturningVisitors(),
        this.getAllPagesAnalytics(),
      ]);

      const newVisitors = totalVisitors - returningVisitors;

      return {
        totalVisitors,
        newVisitors,
        returningVisitors,
        totalPageViews,
        pages: pagesAnalytics,
      };
    } catch (error) {
      throw new InternalServerErrorException(
        `Failed to get dashboard summary: ${error.message}`,
      );
    }
  }
}
