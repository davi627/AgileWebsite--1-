// Recruitment Service for fetching job listings from AgileRecruitment system
// This service will call the SOAP endpoints to get job data

export interface JobListing {
  id: string;
  title: string;
  description: string;
  type: 'Onsite' | 'Remote' | 'Hybrid';
  employment: 'Fulltime' | 'Part-time' | 'Contract';
  startDate: string;
  endDate: string;
  positions: number;
  jobId: string;
}

export interface RecruitmentData {
  No: string;
  Description: string;
  Start_Date: string;
  End_Date: string;
  Positions: number;
  Job_ID: string;
  Submitted_To_Portal: boolean;
}

export interface CompanyJobCardData {
  Job_ID: string;
  Job_Designation: string;
  Objective: string;
}

// For now, we'll use mock data that matches the structure
// In production, this would call the actual SOAP endpoints
export const fetchJobListings = async (page: number = 1, pageSize: number = 4): Promise<{ jobs: JobListing[], totalPages: number, currentPage: number }> => {
  try {
    // Mock data that represents the structure from the recruitment system
    // Extended with more jobs to demonstrate pagination
    const mockRecruitmentData: RecruitmentData[] = [
      {
        No: 'REC001',
        Description: 'Software Developer',
        Start_Date: '2025-01-15',
        End_Date: '2025-02-15',
        Positions: 2,
        Job_ID: 'JOB001',
        Submitted_To_Portal: true
      },
      {
        No: 'REC002',
        Description: 'Business Analyst',
        Start_Date: '2025-01-15',
        End_Date: '2025-02-15',
        Positions: 1,
        Job_ID: 'JOB002',
        Submitted_To_Portal: true
      },
      {
        No: 'REC003',
        Description: 'Project Manager',
        Start_Date: '2025-01-15',
        End_Date: '2025-02-15',
        Positions: 1,
        Job_ID: 'JOB003',
        Submitted_To_Portal: true
      },
      {
        No: 'REC004',
        Description: 'Quality Assurance (QA) Analyst',
        Start_Date: '2025-01-15',
        End_Date: '2025-02-15',
        Positions: 1,
        Job_ID: 'JOB004',
        Submitted_To_Portal: true
      },
      {
        No: 'REC005',
        Description: 'DevOps Engineer',
        Start_Date: '2025-01-15',
        End_Date: '2025-02-15',
        Positions: 1,
        Job_ID: 'JOB005',
        Submitted_To_Portal: true
      },
      {
        No: 'REC006',
        Description: 'UI/UX Designer',
        Start_Date: '2025-01-15',
        End_Date: '2025-02-15',
        Positions: 1,
        Job_ID: 'JOB006',
        Submitted_To_Portal: true
      },
      {
        No: 'REC007',
        Description: 'Data Analyst',
        Start_Date: '2025-01-15',
        End_Date: '2025-02-15',
        Positions: 1,
        Job_ID: 'JOB007',
        Submitted_To_Portal: true
      },
      {
        No: 'REC008',
        Description: 'System Administrator',
        Start_Date: '2025-01-15',
        End_Date: '2025-02-15',
        Positions: 1,
        Job_ID: 'JOB008',
        Submitted_To_Portal: true
      },
      {
        No: 'REC009',
        Description: 'Technical Writer',
        Start_Date: '2025-01-15',
        End_Date: '2025-02-15',
        Positions: 1,
        Job_ID: 'JOB009',
        Submitted_To_Portal: true
      },
      {
        No: 'REC010',
        Description: 'Sales Representative',
        Start_Date: '2025-01-15',
        End_Date: '2025-02-15',
        Positions: 2,
        Job_ID: 'JOB010',
        Submitted_To_Portal: true
      }
    ];

    const mockCompanyJobCardData: CompanyJobCardData[] = [
      {
        Job_ID: 'JOB001',
        Job_Designation: 'Software Developer',
        Objective: 'Design, develop, and maintain innovative software solutions that drive business growth. Work with cutting-edge technologies and collaborate with cross-functional teams to deliver high-quality applications.'
      },
      {
        Job_ID: 'JOB002',
        Job_Designation: 'Business Analyst',
        Objective: 'Bridge the gap between business needs and technical solutions. Analyze requirements, identify improvements, and work closely with stakeholders to ensure successful project delivery.'
      },
      {
        Job_ID: 'JOB003',
        Job_Designation: 'Project Manager',
        Objective: 'Lead and deliver client projects from conception to completion. Plan, execute, and oversee implementation efforts while ensuring quality, timeline, and budget adherence.'
      },
      {
        Job_ID: 'JOB004',
        Job_Designation: 'Quality Assurance (QA) Analyst',
        Objective: 'Ensure the reliability, functionality, and performance of our software solutions. Identify issues, develop test strategies, and maintain high-quality standards across all products.'
      },
      {
        Job_ID: 'JOB005',
        Job_Designation: 'DevOps Engineer',
        Objective: 'Manage and optimize our cloud infrastructure and deployment pipelines. Implement automation, monitoring, and security best practices to ensure reliable and scalable systems.'
      },
      {
        Job_ID: 'JOB006',
        Job_Designation: 'UI/UX Designer',
        Objective: 'Create intuitive and engaging user experiences through thoughtful design. Collaborate with development teams to bring designs to life and ensure user satisfaction.'
      },
      {
        Job_ID: 'JOB007',
        Job_Designation: 'Data Analyst',
        Objective: 'Analyze complex datasets to extract meaningful insights and support business decisions. Create reports and visualizations to communicate findings effectively.'
      },
      {
        Job_ID: 'JOB008',
        Job_Designation: 'System Administrator',
        Objective: 'Maintain and secure our IT infrastructure. Monitor system performance, troubleshoot issues, and implement security measures to ensure optimal operation.'
      },
      {
        Job_ID: 'JOB009',
        Job_Designation: 'Technical Writer',
        Objective: 'Create clear and comprehensive documentation for our products and services. Work with development teams to produce user guides, API documentation, and technical specifications.'
      },
      {
        Job_ID: 'JOB010',
        Job_Designation: 'Sales Representative',
        Objective: 'Build relationships with potential clients and drive business growth. Understand customer needs and present our solutions effectively to achieve sales targets.'
      }
    ];

    // Filter active jobs (submitted to portal and within date range)
    const today = new Date();
    const activeJobs = mockRecruitmentData.filter(job =>
      job.Submitted_To_Portal &&
      new Date(job.Start_Date) <= today &&
      new Date(job.End_Date) >= today
    );

    // Combine recruitment and job card data
    const allJobListings: JobListing[] = activeJobs.map(recruitment => {
      const jobCard = mockCompanyJobCardData.find(card => card.Job_ID === recruitment.Job_ID);

      return {
        id: recruitment.No,
        title: jobCard?.Job_Designation || recruitment.Description,
        description: jobCard?.Objective || 'Job description not available.',
        type: 'Onsite' as const,
        employment: 'Fulltime' as const,
        startDate: recruitment.Start_Date,
        endDate: recruitment.End_Date,
        positions: recruitment.Positions,
        jobId: recruitment.Job_ID
      };
    });

    // Calculate pagination
    const totalPages = Math.ceil(allJobListings.length / pageSize);
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedJobs = allJobListings.slice(startIndex, endIndex);

    return {
      jobs: paginatedJobs,
      totalPages,
      currentPage: page
    };
  } catch (error) {
    console.error('Error fetching job listings:', error);
    return {
      jobs: [],
      totalPages: 0,
      currentPage: 1
    };
  }
};

// Function to handle apply button click
export const handleJobApplication = (jobId: string) => {
  // Redirect to the recruitment portal register page
  window.open('https://careers.agilebiz.co.ke/Account/Register', '_blank');
};
