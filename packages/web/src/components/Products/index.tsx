import React, { useState } from 'react'
import { Tab } from '@headlessui/react'
import ProductTabList from './TabList'
import ProductPanel from './Panel'

interface ProductItem {
  name: string
  image: string
  description: string
}

interface Category {
  category: string
  description?: string
  items: ProductItem[]
}

const products: Category[] = [
  {
    category: 'Customer Relationship Management',
    description:
      'Customer relationship management (CRM) is the combination of practices, strategies, and technologies that companies use to manage and analyze customer interactions and data throughout the customer lifecycle. The goal is to improve customer service relationships, assist in customer retention, and drive sales growth. Agile Business Solutions offers Microsoft Dynamics 365 for Customer Engagement which includes:',
    items: [
      {
        name: 'Dynamics 365 Sales',
        image: '/path/to/dynamics-365-sales.jpg',
        description:
          'Dynamics 365 Sales enables your sales team to build strong relationships with customers, take actions based on insights, and close sales faster. With this tool, you can streamline your sales processes and enhance your team’s productivity by leveraging real-time data and predictive insights. Empower your sales team with advanced AI capabilities and seamless integration with Microsoft 365, ensuring they have all the tools they need to succeed.'
      },
      {
        name: 'Dynamics 365 Customer Service',
        image: '/path/to/dynamics-365-customer-service.jpg',
        description:
          'Dynamics 365 Customer Service helps organizations deliver exceptional customer experiences. This solution provides comprehensive customer support capabilities, including case management, a knowledge base, and automated workflows, ensuring that every customer interaction is smooth and efficient. Deliver personalized customer experiences, reduce resolution times, and increase customer satisfaction with an integrated platform that brings together all your service operations.'
      },
      {
        name: 'Dynamics 365 Marketing',
        image: '/path/to/dynamics-365-marketing.jpg',
        description:
          'Dynamics 365 Marketing allows businesses to orchestrate personalized journeys across all touchpoints to strengthen relationships and earn loyalty. It includes advanced marketing automation, customer segmentation, and campaign management tools to drive successful marketing strategies. Maximize your marketing ROI with powerful analytics and AI-driven insights that help you understand customer behavior and optimize your campaigns for better results.'
      },
      {
        name: 'Dynamics 365 Field Service',
        image: '/path/to/dynamics-365-field-service.jpg',
        description:
          'Dynamics 365 Field Service empowers your service teams to deliver proactive and predictive service. The solution includes scheduling, dispatching, and inventory management capabilities, helping you optimize resource utilization and enhance customer satisfaction. Increase operational efficiency and provide outstanding on-site service with real-time updates, automated scheduling, and mobile capabilities that keep your field technicians connected and informed.'
      },
      {
        name: 'Dynamics 365 Project Service Automation',
        image: '/path/to/dynamics-365-project-service-automation.jpg',
        description:
          'Dynamics 365 Project Service Automation provides an end-to-end solution for managing projects, from planning and estimation to execution and tracking. It integrates seamlessly with other Dynamics 365 applications, ensuring comprehensive project visibility and control. Deliver projects on time and within budget with advanced tools for resource management, project planning, and performance tracking, all integrated into one powerful platform.'
      }
    ]
  },
  {
    category: 'Enterprise Document Management',
    items: [
      {
        name: 'Microsoft SharePoint',
        image: '/path/to/sharepoint.jpg',
        description:
          'Microsoft SharePoint is a web-based collaboration platform that integrates with Microsoft Office. It is used for storing, organizing, sharing, and accessing information from any device. Its robust document management capabilities help teams collaborate effectively and securely. Streamline your document workflows, enhance team collaboration, and ensure data security with SharePoint’s advanced features for document management and collaboration.'
      }
    ]
  },
  {
    category: 'Analytics, ML and AI',
    items: [
      {
        name: 'Microsoft Power BI',
        image: '/path/to/power-bi.jpg',
        description:
          'Microsoft Power BI is a suite of business analytics tools that deliver insights throughout your organization. Connect to hundreds of data sources, simplify data prep, and drive ad hoc analysis. Produce beautiful reports and publish them for your organization to consume on the web and across mobile devices. Transform your data into actionable insights with interactive dashboards and advanced analytics, empowering everyone in your organization to make data-driven decisions.'
      }
    ]
  },
  {
    category: 'Cloud Solutions',
    items: [
      {
        name: 'Microsoft Azure',
        image: '/path/to/azure.jpg',
        description:
          'Microsoft Azure is a comprehensive cloud computing platform offering a range of services including computing, analytics, storage, and networking. Azure enables you to build, deploy, and manage applications through Microsoft’s global network of data centers, providing scalability and reliability for your business needs. Accelerate your digital transformation with Azure’s secure and flexible cloud solutions, tailored to meet the demands of your business.'
      },
      {
        name: 'Microsoft 365',
        image: '/path/to/microsoft-365.jpg',
        description:
          'Microsoft 365 is a productivity cloud that brings together best-in-class Office apps with powerful cloud services, device management, and advanced security. Whether working in the office or remotely, Microsoft 365 provides the tools to collaborate seamlessly and securely. Boost your team’s productivity and collaboration with integrated tools like Teams, SharePoint, and OneDrive, all secured by Microsoft’s leading security features.'
      }
    ]
  },
  {
    category: 'ICT Infrastructure',
    items: [
      {
        name: 'Backup and Disaster Recovery',
        image: '/path/to/backup-disaster-recovery.jpg',
        description:
          'Our Backup and Disaster Recovery solutions ensure that your data is always protected and can be quickly restored in the event of a disaster. We offer robust backup solutions that are scalable and reliable, minimizing downtime and data loss for your business. Safeguard your critical business data with automated backups, comprehensive disaster recovery plans, and fast recovery times, ensuring business continuity no matter what.'
      },
      {
        name: 'Virtualization',
        image: '/path/to/virtualization.jpg',
        description:
          'Our Virtualization services help you maximize the efficiency and flexibility of your IT infrastructure. By creating virtual environments, we enable you to reduce hardware costs, improve system utilization, and streamline your IT operations. Leverage the power of virtualization to optimize your IT resources, enhance scalability, and reduce operational costs while maintaining high performance and reliability.'
      },
      {
        name: 'CCTV and Biometrics',
        image: '/path/to/cctv-biometrics.jpg',
        description:
          'Our CCTV and Biometrics solutions provide enhanced security and monitoring capabilities for your organization. From surveillance cameras to biometric access controls, we deliver comprehensive security solutions that protect your assets and ensure safety. Enhance your security infrastructure with advanced surveillance systems and biometric technologies that provide real-time monitoring and access control.'
      },
      {
        name: 'Network Infrastructure and Security',
        image: '/path/to/network-infrastructure-security.jpg',
        description:
          'Our Network Infrastructure and Security solutions are designed to build and secure robust network environments. We offer network design, implementation, and security services that ensure your network is resilient, efficient, and protected against threats. Ensure the reliability and security of your network with our comprehensive infrastructure solutions, designed to meet the evolving needs of your business.'
      },
      {
        name: 'End User Computing Devices',
        image: '/path/to/end-user-computing-devices.jpg',
        description:
          'Our End User Computing Devices solutions provide employees with the tools they need to be productive and efficient. From desktops and laptops to mobile devices, we offer a range of computing solutions that meet the diverse needs of your workforce. Equip your team with the latest computing devices and peripherals, ensuring they have the tools they need to work efficiently, whether in the office or remotely.'
      }
    ]
  },
  {
    category: 'Mobile Applications and Web Portals',
    items: [
      {
        name: 'Android and IOS',
        image: '/path/to/android-ios.jpg',
        description:
          'We develop mobile applications for both Android and iOS platforms that deliver seamless user experiences and powerful functionalities. Our team specializes in creating custom mobile apps that meet your business requirements and engage your users effectively. Enhance your digital presence with innovative mobile applications that offer intuitive interfaces, robust features, and seamless performance.'
      }
    ]
  },
  {
    category: 'Bulk SMS and USSD Query Services',
    items: [
      {
        name: 'Bulk Pull and Push SMS',
        image: '/path/to/bulk-sms.jpg',
        description:
          'Our Bulk Pull and Push SMS services enable you to send and receive large volumes of SMS messages efficiently. Whether for marketing campaigns, notifications, or customer engagement, our SMS solutions provide reliable and scalable communication channels. Reach your audience instantly with our bulk SMS services, designed to handle high volumes of messages with ease and reliability.'
      },
      {
        name: 'E-Voting Solution',
        image: '/path/to/e-voting.jpg',
        description:
          'Our E-Voting Solution offers a secure and efficient platform for conducting electronic voting. Designed for organizations and institutions, our solution ensures the integrity and transparency of the voting process while providing a user-friendly interface for voters. Simplify your voting process with our secure e-voting solution, ensuring accurate results and enhancing voter participation.'
      }
    ]
  }
]

const Products: React.FC = () => {
  const [, setSelectedCategoryIndex] = useState(0)
  const [openDisclosure, setOpenDisclosure] = useState<number | null>(null)

  const handleCategoryChange = (index: number) => {
    setSelectedCategoryIndex(index)
    setOpenDisclosure(null)
  }

  const handleDisclosureToggle = (index: number) => {
    setOpenDisclosure(openDisclosure === index ? null : index)
  }

  return (
    <div className="mx-auto mt-4 max-w-6xl px-4 py-3 sm:px-0 sm:pt-24">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-primary text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
          Our Products
        </h2>
      </div>
      <Tab.Group
        as="div"
        className="flex flex-col pt-16 lg:flex-row"
        onChange={handleCategoryChange}
      >
        <ProductTabList
          categories={products}
          onCategoryChange={handleCategoryChange}
        />
        <Tab.Panels className="grow overflow-y-auto rounded-r p-2 lg:max-h-screen">
          {products.map((category) => (
            <ProductPanel
              key={category.category}
              category={category}
              openDisclosure={openDisclosure}
              onDisclosureToggle={handleDisclosureToggle}
            />
          ))}
        </Tab.Panels>
      </Tab.Group>
    </div>
  )
}

export default Products
