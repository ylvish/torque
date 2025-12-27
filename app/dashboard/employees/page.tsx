'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { getEmployees } from '@/lib/actions';
import { UserRole } from '@/types';
import { Shield, Mail, Calendar, User, Search, Lock } from 'lucide-react';

export default function EmployeesPage() {
    const { isCEO, isLoading } = useAuth();
    const router = useRouter();
    const [employees, setEmployees] = useState<any[]>([]);
    const [isFetching, setIsFetching] = useState(true);

    useEffect(() => {
        if (!isLoading && !isCEO) {
            router.push('/dashboard');
        }
    }, [isLoading, isCEO, router]);

    useEffect(() => {
        const loadEmployees = async () => {
            const data = await getEmployees();
            setEmployees(data);
            setIsFetching(false);
        };

        if (isCEO) {
            loadEmployees();
        }
    }, [isCEO]);

    if (isLoading || (!isCEO && isFetching)) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500" />
            </div>
        );
    }

    if (!isCEO) return null;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-white">Employees</h1>
                <p className="text-white/50">Manage staff access and credentials</p>
            </div>

            {/* List */}
            <div className="grid gap-4">
                {employees.map((employee) => (
                    <div
                        key={employee.id}
                        className="bg-zinc-900 border border-white/5 rounded-xl p-4 flex flex-col md:flex-row md:items-center gap-4 hover:border-white/10 transition-colors"
                    >
                        {/* Avatar */}
                        <div className="w-12 h-12 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-500 font-bold text-lg shrink-0">
                            {employee.name.charAt(0)}
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                            <h3 className="text-lg font-bold text-white truncate">{employee.name}</h3>
                            <div className="flex flex-wrap gap-4 mt-1 text-sm text-white/50">
                                <span className="flex items-center gap-1.5">
                                    <Mail className="w-4 h-4" />
                                    {employee.email}
                                </span>
                                <span className="flex items-center gap-1.5">
                                    <Shield className="w-4 h-4" />
                                    {employee.role}
                                </span>
                                <span className="flex items-center gap-1.5">
                                    <Calendar className="w-4 h-4" />
                                    Joined {new Date(employee.created_at).toLocaleDateString()}
                                </span>
                            </div>
                        </div>

                        {/* Credentials Card (Demo Only) */}
                        <div className="bg-zinc-950 rounded-lg p-3 border border-white/5 min-w-[200px]">
                            <h4 className="text-xs font-medium text-white/40 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                                <Lock className="w-3 h-3" /> Credentials
                            </h4>
                            <div className="space-y-1 text-sm font-mono text-white/70">
                                <p><span className="text-white/30 select-none">ID:</span> {employee.id.substring(0, 8)}...</p>
                                <p><span className="text-white/30 select-none">PW:</span> password123</p>
                            </div>
                        </div>
                    </div>
                ))}

                {!isFetching && employees.length === 0 && (
                    <div className="text-center py-12 bg-zinc-900/50 rounded-xl border border-white/5 border-dashed">
                        <User className="h-12 w-12 text-white/20 mx-auto mb-3" />
                        <p className="text-white/40">No employees found.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
