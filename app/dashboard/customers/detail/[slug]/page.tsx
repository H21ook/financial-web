import { Suspense } from 'react'
import CustomerDetails from '@/components/custom/customer-detail';
import { getAllSubRegions, getBusinessClasses, getCustomerDetails, getRegions } from '@/lib/services';

const CustomerDetailsContent = async ({ params }: { params: Promise<{ slug: string }> }) => {
    const { slug } = await params;
    const res = await getCustomerDetails(slug);
    const regions = await getRegions()
    const businessClasses = await getBusinessClasses()
    const subRegions = await getAllSubRegions()

    if (res === null) {
        return <div>Error loading customer details.</div>
    }

    return (
        <div>
            <div className="max-w-7xl mx-auto space-y-8">
                <CustomerDetails data={res.data} referenceData={{
                    regions,
                    businessClasses,
                    allSubRegions: subRegions
                }}/>
            </div>
        </div>
    )
}

const CustomerDetailsPage = ({
    params,
}: {
    params: Promise<{ slug: string }>
}) => {

    return (
        <Suspense fallback={<div>Loading...</div>}>
            <CustomerDetailsContent params={params} />
        </Suspense>
    )
}

export default CustomerDetailsPage