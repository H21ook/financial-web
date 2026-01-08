import CustomersList from '@/components/custom/customers-list'
import CustomerListLoader from '@/components/custom/customers-list/loader'
import { getBusinessClasses } from '@/lib/services'
import { Suspense } from 'react'

const CustomersPage = async () => {

    const businessClasses = await getBusinessClasses()

    return (
        <div>
            <div className="max-w-7xl mx-auto">
                <Suspense fallback={<CustomerListLoader />}>
                    <CustomersList
                        businessClasses={businessClasses}
                    />
                </Suspense>
            </div>
        </div>
    )
}

export default CustomersPage