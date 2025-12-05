"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import React from "react";

type InvalidRoleProps = {
	menuName?: string;
	title?: string;
	description?: string;
	homeHref?: string;
	className?: string;
	/** Optional extra actions rendered beside the default buttons */
	actions?: React.ReactNode;
};

/**
 * Access denied notice for unauthorized users.
 *
 * Example:
 * <InvalidRole menuName="Pengaturan Admin" homeHref="/user/dashboard" />
 */
export default function InvalidRole({
	menuName = "menu ini",
	title = "Akses Ditolak",
	description = "Anda tidak memiliki izin untuk mengakses halaman ini.",
	homeHref = "/",
	className,
	actions,
}: InvalidRoleProps) {
	const router = useRouter();

	return (
        <div className="h-dvh flex items-center justify-center">
            <div className={cn("w-full max-w-lg align-center justify-center m-auto", className)}>
                <Card className="border-dashed">
                    <CardHeader className="text-center space-y-3">
                        <div className="mx-auto h-12 w-12 rounded-full bg-red-50 flex items-center justify-center">
                            <Lock className="h-6 w-6 text-red-600" />
                        </div>
                        <CardTitle className="text-xl font-semibold">{title}</CardTitle>
                        <div className="flex flex-col items-center justify-center gap-2 text-sm text-muted-foreground">
                            <Badge variant="warning">403 - Forbidden</Badge>
                            <p className="text-center max-w-md">
                                {description}
                            </p>
                            {menuName && menuName !== "menu ini" && (
                                <p className="text-center">
                                    Tidak ada akses ke <b>{menuName}</b>.
                                </p>
                            )}
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col sm:flex-row gap-2 justify-center">
                            <Button variant="secondary" onClick={() => router.back()}>
                                Kembali
                            </Button>
                            <Button asChild>
                                <Link href={homeHref}>Dashboard Saya</Link>
                            </Button>
                            {actions}
                        </div>
                        <p className="mt-4 text-center text-xs text-muted-foreground">
                            Jika ini sebuah kesalahan, silakan hubungi administrator.
                        </p>
                    </CardContent>
                </Card>
            </div>
        </div>
	);
}

