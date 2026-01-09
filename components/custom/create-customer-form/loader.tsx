import { Skeleton } from "@/components/ui/skeleton";

function FieldSkeleton({
    labelWidth = "w-40",
    height = "h-9",
}: {
    labelWidth?: string;
    height?: string;
}) {
    return (
        <div className="space-y-2">
            <Skeleton className={`${labelWidth} h-3`} />
            <Skeleton className={`w-full ${height} rounded-md`} />
        </div>
    );
}

function SelectSkeleton({ labelWidth = "w-48" }: { labelWidth?: string }) {
    return <FieldSkeleton labelWidth={labelWidth} height="h-9" />;
}

function ButtonSkeleton({ width = "w-40" }: { width?: string }) {
    return <Skeleton className={`${width} h-9 rounded-md`} />;
}

function SectionTitleSkeleton({ width = "w-56" }: { width?: string }) {
    return <Skeleton className={`${width} h-4`} />;
}

export function CustomerCreateFormLoader() {
    return (
        <div className="space-y-8">
            {/* Top single select */}
            <div className="space-y-4 grid md:grid-cols-3">
                <div className="space-y-2">
                    <FieldSkeleton labelWidth="w-40" />
                    <Skeleton className="w-64 h-3" />
                </div>
            </div>

            {/* Байгууллагын мэдээлэл */}
            <div className="space-y-4">
                <SectionTitleSkeleton width="w-60" />

                {/* Row 1: RD + button */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                    <div >
                        <FieldSkeleton labelWidth="w-40" />
                    </div>
                    <div >
                        <ButtonSkeleton width="w-28" />
                    </div>
                </div>

                {/* Row 2: Name, TIN, Business */}
                <div className="grid md:grid-cols-3 gap-4">
                    <div>
                        <FieldSkeleton labelWidth="w-44" />
                    </div>
                    <div>
                        <FieldSkeleton labelWidth="w-28" />
                    </div>
                    <div>
                        <SelectSkeleton labelWidth="w-32" />
                    </div>
                </div>
            </div>

            {/* Захирлын мэдээлэл */}
            <div className="space-y-4">
                <SectionTitleSkeleton width="w-52" />

                {/* Reg + button */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                    <div>
                        <FieldSkeleton labelWidth="w-40" />
                    </div>
                    <div>
                        <ButtonSkeleton width="w-40" />
                    </div>
                </div>

                {/* Last name / First name */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <FieldSkeleton labelWidth="w-24" />
                    </div>
                    <div>
                        <FieldSkeleton labelWidth="w-24" />
                    </div>
                </div>
            </div>

            {/* Байгууллагын хаягийн мэдээлэл */}
            <div className="space-y-4">
                <SectionTitleSkeleton width="w-64" />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <SelectSkeleton labelWidth="w-28" />
                    </div>
                    <div>
                        <SelectSkeleton labelWidth="w-28" />
                    </div>
                    <div>
                        <FieldSkeleton labelWidth="w-16" />
                    </div>
                </div>
            </div>

            {/* Холбоо барих мэдээлэл */}
            <div className="space-y-4">
                <SectionTitleSkeleton width="w-56" />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <FieldSkeleton labelWidth="w-16" />
                    </div>
                    <div>
                        <FieldSkeleton labelWidth="w-20" />
                    </div>
                </div>
            </div>
        </div>
    );
}
