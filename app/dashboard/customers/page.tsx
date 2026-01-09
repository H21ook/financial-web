import CustomersList from '@/components/custom/customers-list'
import CustomerListLoader from '@/components/custom/customers-list/loader'
import { getBusinessClasses, getCustomersList } from '@/lib/services'
import { Suspense } from 'react'

const CustomersPageContent = async () => {
    const businessClasses = await getBusinessClasses()
    const customersList = await getCustomersList()

    return <Suspense fallback={<CustomerListLoader />}>
        <CustomersList
            data={customersList}
            businessClasses={businessClasses}
        />
    </Suspense>
}

const CustomersPage = async () => {
    return (
        <div>
            <div className="max-w-7xl mx-auto">
                <CustomersPageContent />
            </div>
        </div>
    )
}

export default CustomersPage