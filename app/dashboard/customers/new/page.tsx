
import Breadcrumb from '@/components/custom/Breadcrumb'
import CreateCustomerForm from '@/components/custom/create-customer-form'
import { CustomerCreateFormLoader } from '@/components/custom/create-customer-form/loader'
import { getAllSubRegions, getBusinessClasses, getRegions } from '@/lib/services'
import { Suspense } from 'react'

const CreateCustomerPage = async () => {

    const regions = await getRegions()
    const businessClasses = await getBusinessClasses()
    const subRegions = await getAllSubRegions()

    return (
        <div>
            <div className="max-w-7xl mx-auto">
                <Breadcrumb paths={[
                    { name: "Харилцагчид" },
                ]} />
                <div className="flex justify-between items-center mb-4">
                    <div>
                        <h1 className="text-2xl font-bold mb-1">Шинэ харилцагч нэмэх</h1>
                    </div>
                </div>
                <div className="py-8">
                    <Suspense fallback={<CustomerCreateFormLoader />}>
                        <CreateCustomerForm regions={regions} businessClasses={businessClasses} allSubRegions={subRegions} />
                    </Suspense>
                </div>
            </div>
        </div>
    )
}

export default CreateCustomerPage