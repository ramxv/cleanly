import { AdminService } from '../services/admin.service';
import { VerifyWorkerDto } from '../dto/verify-worker.dto';
import { ResolveDisputeDto } from '../dto/resolve-dispute.dto';
export declare class AdminController {
    private readonly adminService;
    constructor(adminService: AdminService);
    getMetrics(days?: string): Promise<import("../interfaces/iadmin.repository").PlatformMetrics>;
    getPendingWorkers(): Promise<{
        id: string;
        userId: string;
        fullName: string;
        bio: string | null;
        avgRating: number;
        reviewCount: number;
        isPremium: boolean;
        serviceTypes: import("@prisma/client").$Enums.ServiceType[];
        verificationStatus: import("@prisma/client").$Enums.VerificationStatus;
        documentUrls: string[];
        hourlyRate: import("@prisma/client/runtime/library").Decimal | null;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    verifyWorker(dto: VerifyWorkerDto): Promise<{
        id: string;
        userId: string;
        fullName: string;
        bio: string | null;
        avgRating: number;
        reviewCount: number;
        isPremium: boolean;
        serviceTypes: import("@prisma/client").$Enums.ServiceType[];
        verificationStatus: import("@prisma/client").$Enums.VerificationStatus;
        documentUrls: string[];
        hourlyRate: import("@prisma/client/runtime/library").Decimal | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    suspendUser(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        email: string;
        passwordHash: string | null;
        role: import("@prisma/client").$Enums.Role;
        isVerified: boolean;
        isSuspended: boolean;
        deletedAt: Date | null;
    }>;
    unsuspendUser(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        email: string;
        passwordHash: string | null;
        role: import("@prisma/client").$Enums.Role;
        isVerified: boolean;
        isSuspended: boolean;
        deletedAt: Date | null;
    }>;
    resolveDispute(_dto: ResolveDisputeDto): {
        message: string;
    };
}
