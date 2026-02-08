import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../../common/prisma/prisma.service';
import { EmailQueueService } from '../../common/email/email-queue.service';
import { LoginDto } from './dto/login.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { ResendOtpDto } from './dto/resend-otp.dto';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private prismaService: PrismaService,
    private emailQueueService: EmailQueueService,
  ) {}

  /**
   * Login: Validates credentials and sends OTP
   */
  async login(loginDto: LoginDto) {
    const user = await this.prismaService.client.user.findUnique({
      where: { email: loginDto.email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Generate and save OTP
    const otp = this.generateOtp();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    await this.prismaService.client.user.update({
      where: { id: user.id },
      data: {
        otp,
        otpExpiry,
      },
    });

    // Queue OTP email to be sent
    await this.emailQueueService.sendOtpEmail(user.email, otp, user.name);
    console.log(`🔐 OTP for ${user.email}: ${otp}`);

    return {
      message: 'OTP sent successfully. Please verify to complete login.',
      email: user.email,
      // Remove this in production - only for development
      otp: process.env.NODE_ENV === 'development' ? otp : undefined,
    };
  }

  /**
   * Verify OTP and issue JWT token
   */
  async verifyOtp(verifyOtpDto: VerifyOtpDto) {
    const user = await this.prismaService.client.user.findUnique({
      where: { email: verifyOtpDto.email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!user.otp || !user.otpExpiry) {
      throw new BadRequestException('No OTP found. Please request a new one.');
    }

    if (new Date() > user.otpExpiry) {
      throw new BadRequestException('OTP has expired. Please request a new one.');
    }

    if (user.otp !== verifyOtpDto.otp) {
      throw new UnauthorizedException('Invalid OTP');
    }

    // Mark user as verified and clear OTP
    await this.prismaService.client.user.update({
      where: { id: user.id },
      data: {
        isVerified: true,
        otp: null,
        otpExpiry: null,
      },
    });

    // Generate JWT token
    const payload = { sub: user.id, email: user.email };
    const access_token = await this.jwtService.signAsync(payload);

    return {
      access_token,
      user: this.sanitizeUser(user),
    };
  }

  /**
   * Resend OTP
   */
  async resendOtp(resendOtpDto: ResendOtpDto) {
    const user = await this.prismaService.client.user.findUnique({
      where: { email: resendOtpDto.email },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    // Generate and save new OTP
    const otp = this.generateOtp();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    await this.prismaService.client.user.update({
      where: { id: user.id },
      data: {
        otp,
        otpExpiry,
      },
    });

    // Queue OTP email to be sent
    await this.emailQueueService.sendOtpEmail(user.email, otp, user.name);
    console.log(`🔐 New OTP for ${user.email}: ${otp}`);

    return {
      message: 'OTP resent successfully',
      email: user.email,
      // Remove this in production - only for development
      otp: process.env.NODE_ENV === 'development' ? otp : undefined,
    };
  }

  /**
   * Generate a 6-digit OTP
   */
  private generateOtp(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  /**
   * Remove sensitive information from user object
   */
  private sanitizeUser(user: any) {
    const { password, otp, otpExpiry, ...result } = user;
    return result;
  }
}
