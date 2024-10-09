import { env } from "@undb/env"
import { templates,type IBaseTemplateDTO,type ITemplateDTO } from "@undb/template"

function getTemplateImage(folder: string, file: string) {
  return env.UNDB_BASE_URL + "/assets/templates/" + folder + "/" + file
}

export const templateData: ITemplateDTO[] = [
  {
    id: "550e8400-e29b-41d4-a716-446655440000",
    icon: "🚀",
    name: "Project Management",
    categories: ["it", "project", "startup"],
    cover: getTemplateImage("projectManagement", "cover.jpg"),
    images: [
      getTemplateImage("projectManagement", "image1.jpeg"),
      getTemplateImage("projectManagement", "image2.jpeg"),
      getTemplateImage("projectManagement", "image3.jpeg"),
    ],
    description:
      "A comprehensive template for managing projects, tasks, and team collaboration. It includes features for tracking project progress, assigning tasks, managing resources, and facilitating team communication, helping you achieve project goals more efficiently.",
    detail: `
      <h1>Streamline Your Projects with UnDB's Project Management Template</h1>
      <h2>Comprehensive Project Management Features</h2>
      <p>UnDB's Project Management template offers a powerful set of tools to enhance your team's productivity and project success:</p>
      <ul>
        <li>Task Tracking: Easily create, assign, and monitor project tasks</li>
        <li>Resource Management: Efficiently allocate team members and resources</li>
        <li>Insightful Reporting: Generate detailed project analytics and reports</li>
        <li>Time Optimization: Track task completion times to improve workflows</li>
      </ul>
      <h2>Why Choose UnDB for Project Management?</h2>
      <p>UnDB offers unique advantages for your project management needs:</p>
      <ul>
        <li>Customizable: Tailor the template to fit your specific project requirements</li>
        <li>User-Friendly: Intuitive interface for easy adoption across your team</li>
        <li>Scalable: Grows with your projects, from small tasks to complex initiatives</li>
        <li>Integration-Ready: Seamlessly connects with other UnDB templates and tools</li>
        <li>Data-Driven: Make informed decisions with real-time project insights</li>
      </ul>
    `,
    template: {
      type: "base",
      template: templates.projectManagement as IBaseTemplateDTO,
    },
  },
  {
    id: "6ba7b814-9dad-11d1-80b4-00c04fd430c8",
    icon: "💼",
    name: "CRM",
    categories: ["sales"],
    cover: getTemplateImage("crm", "cover.jpg"),
    description: "A template for managing customer relationships, deals, and activities.",
    images: [
      getTemplateImage("crm", "image1.jpeg"),
      getTemplateImage("crm", "image2.jpeg"),
      getTemplateImage("crm", "image3.jpeg"),
      getTemplateImage("crm", "image4.jpeg"),
    ],
    detail: `
      <h1>Maximize Your Sales with UnDB's CRM Template</h1>
      <h2>Comprehensive CRM Features</h2>
      <p>UnDB's CRM template provides a comprehensive set of tools to enhance your sales and customer relationship management:</p>
      <ul>
        <li>Customer Relationship Management: Track customer interactions, preferences, and history</li>
        <li>Deal Tracking: Monitor and manage sales opportunities and deals</li>
        <li>Activity Management: Track and manage customer activities and communications</li>
        <li>Insightful Reporting: Generate detailed sales analytics and reports</li>
        <li>Data-Driven Insights: Make informed decisions with real-time customer data</li>
      </ul>
      <h2>Why Choose UnDB for CRM?</h2>
      <p>UnDB offers unique advantages for your CRM needs:</p>
      <ul>
        <li>Customizable: Tailor the template to fit your specific sales and customer relationship management requirements</li>
        <li>User-Friendly: Intuitive interface for easy adoption across your team</li>
        <li>Scalable: Grows with your sales and customer relationships, from small deals to complex customer interactions</li>
        <li>Integration-Ready: Seamlessly connects with other UnDB templates and tools</li>
        <li>Data-Driven: Make informed decisions with real-time customer data</li>
      </ul>
    `,
    template: {
      type: "base",
      template: templates.crm as IBaseTemplateDTO,
    },
  },
  {
    id: "f47ac10b-58cc-4372-a567-0e02b2c3d479",
    icon: "💼",
    name: "Sales CRM",
    cover: getTemplateImage("salesCrm", "cover.jpg"),
    categories: ["sales", "crm"],
    images: [getTemplateImage("salesCrm", "image1.png"), getTemplateImage("salesCrm", "image2.png")],
    description:
      "A CRM for sales. It includes features for tracking customer interactions, managing deals, and analyzing sales data.",
    detail: `
      <h1>Maximize Your Sales with UnDB's CRM Template</h1>
      <h2>Comprehensive CRM Features</h2>
      <p>UnDB's CRM template provides a comprehensive set of tools to enhance your sales and customer relationship management:</p>
      <ul>
        <li>Customer Relationship Management: Track customer interactions, preferences, and history</li>
        <li>Deal Tracking: Monitor and manage sales opportunities and deals</li>
        <li>Activity Management: Track and manage customer activities and communications</li>
        <li>Insightful Reporting: Generate detailed sales analytics and reports</li>
        <li>Data-Driven Insights: Make informed decisions with real-time customer data</li>
      </ul>
      <h2>Why Choose UnDB for CRM?</h2>
      <p>UnDB offers unique advantages for your CRM needs:</p>
      <ul>
        <li>Customizable: Tailor the template to fit your specific sales and customer relationship management requirements</li>
        <li>User-Friendly: Intuitive interface for easy adoption across your team</li>
        <li>Scalable: Grows with your sales and customer relationships, from small deals to complex customer interactions</li>
        <li>Integration-Ready: Seamlessly connects with other UnDB templates and tools</li>
        <li>Data-Driven: Make informed decisions with real-time customer data</li>
      </ul>
    `,
    template: {
      type: "base",
      template: templates.salesCrm as IBaseTemplateDTO,
    },
  },
  {
    id: "6ba7b810-9dad-11d1-80b4-00c04fd430c8",
    icon: "🎉",
    name: "Event Planning List",
    cover: getTemplateImage("eventPlanning", "cover.jpg"),
    images: [
      getTemplateImage("eventPlanning", "image1.png"),
      getTemplateImage("eventPlanning", "image2.png"),
      getTemplateImage("eventPlanning", "image3.png"),
      getTemplateImage("eventPlanning", "image4.png"),
    ],
    description: "A template for planning events, including tasks, deadlines, and resources.",
    detail: `
      <h1>Streamline Your Event Planning with UnDB's Event Planning Template</h1>
      <h2>Comprehensive Event Planning Features</h2>
      <p>UnDB's Event Planning template offers a powerful set of tools to enhance your event planning process:</p>
      <ul>
        <li>Task Tracking: Easily create, assign, and monitor event planning tasks</li>
        <li>Resource Management: Efficiently allocate resources such as venues, catering, and entertainment</li>
        <li>Insightful Reporting: Generate detailed event analytics and reports</li>
        <li>Time Optimization: Track task completion times to improve event planning efficiency</li>
      </ul>
      <h2>Why Choose UnDB for Event Planning?</h2>
      <p>UnDB offers unique advantages for your event planning needs:</p>
      <ul>
        <li>Customizable: Tailor the template to fit your specific event planning requirements</li>
        <li>User-Friendly: Intuitive interface for easy adoption across your team</li>
        <li>Scalable: Grows with your events, from small gatherings to large-scale conferences</li>
        <li>Integration-Ready: Seamlessly connects with other UnDB templates and tools</li>
        <li>Data-Driven: Make informed decisions with real-time event data</li>
      </ul>
    `,
    categories: ["personal"],
    template: {
      type: "base",
      template: templates.eventPlaningList as IBaseTemplateDTO,
    },
  },
  {
    id: "6ba7b811-9dad-11d1-80b4-00c04fd430c8",
    icon: "📝",
    name: "To-Do List",
    categories: ["other", "personal"],
    cover: getTemplateImage("todo", "cover.jpg"),
    images: [getTemplateImage("todo", "image1.png"), getTemplateImage("todo", "image2.png")],
    description: "A simple template for managing daily tasks and reminders.",
    detail: `
      <h1>Streamline Your Daily Tasks with UnDB's To-Do List Template</h1>
      <h2>Comprehensive To-Do List Features</h2>
      <p>UnDB's To-Do List template offers a powerful set of tools to enhance your daily task management:</p>
      <ul>
        <li>Task Tracking: Easily create, assign, and monitor daily tasks</li>
        <li>Resource Management: Efficiently allocate resources such as venues, catering, and entertainment</li>
        <li>Insightful Reporting: Generate detailed event analytics and reports</li>
        <li>Time Optimization: Track task completion times to improve event planning efficiency</li>
      </ul>
    `,
    template: {
      type: "base",
      template: templates.todoList as IBaseTemplateDTO,
    },
  },
  {
    id: "6ba7b813-9dad-11d1-80b4-00c04fd430c8",
    icon: "📦",
    name: "Office Inventory Management",
    categories: ["finance"],
    cover: getTemplateImage("officeInventoryManagement", "cover.jpg"),
    images: [
      getTemplateImage("officeInventoryManagement", "image1.png"),
      getTemplateImage("officeInventoryManagement", "image2.png"),
      getTemplateImage("officeInventoryManagement", "image3.png"),
      getTemplateImage("officeInventoryManagement", "image4.png"),
    ],
    description: "A template for managing office supplies, equipment, and inventory.",
    detail: `
      <h1>Streamline Your Office Inventory with UnDB's Office Inventory Management Template</h1>
      <h2>Comprehensive Office Inventory Management Features</h2>
      <p>UnDB's Office Inventory Management template offers a powerful set of tools to enhance your office inventory management:</p>
      <ul>
        <li>Inventory Tracking: Easily create, assign, and monitor office inventory</li>
        <li>Resource Management: Efficiently allocate resources such as venues, catering, and entertainment</li>
        <li>Insightful Reporting: Generate detailed event analytics and reports</li>
        <li>Time Optimization: Track task completion times to improve event planning efficiency</li>
      </ul>
    `,
    template: {
      type: "base",
      template: templates.officeInventoryManagement as IBaseTemplateDTO,
    },
  },
  {
    id: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    icon: "📸",
    name: "Social Media Content",
    categories: ["marketing"],
    cover: getTemplateImage("socialMediaContent", "cover.jpg"),
    images: [
      getTemplateImage("socialMediaContent", "image1.png"),
      getTemplateImage("socialMediaContent", "image2.png"),
    ],
    description: "A template for managing social media content, including posts, images, and videos.",
    detail: `
      <h1>Streamline Your Social Media Content with UnDB's Social Media Content Template</h1>
      <h2>Comprehensive Social Media Content Features</h2>
      <p>UnDB's Social Media Content template offers a powerful set of tools to enhance your social media content management:</p>
      <ul>
        <li>Content Creation: Easily create, assign, and monitor social media content</li>
        <li>Resource Management: Efficiently allocate resources such as venues, catering, and entertainment</li>
        <li>Insightful Reporting: Generate detailed event analytics and reports</li>
        <li>Time Optimization: Track task completion times to improve event planning efficiency</li>
      </ul>
    `,
    template: {
      type: "base",
      template: templates.socialMediaContent as IBaseTemplateDTO,
    },
  },
  {
    id: "6ba7b815-9dad-11d1-80b4-00c04fd430c8",
    icon: "👨‍👧‍👦",
    name: "Human Resource Management",
    categories: ["hr"],
    cover: getTemplateImage("hr", "cover.jpg"),
    images: [getTemplateImage("hr", "image1.png"), getTemplateImage("hr", "image2.png")],
    description: "A template for managing human resources, including employees, positions, and departments.",
    detail: `
      <h1>Streamline Your Human Resource Management with UnDB's HR Management Template</h1>
      <h2>Comprehensive HR Management Features</h2>
      <p>UnDB's HR Management template offers a powerful set of tools to enhance your human resource management:</p>
      <ul>
        <li>Employee Management: Easily create, assign, and monitor employee records</li>
        <li>Department Organization: Efficiently structure and manage company departments</li>
        <li>Payroll Administration: Track and manage employee compensation, including salaries, bonuses, and benefits</li>
        <li>Performance Evaluation: Set up and conduct regular performance reviews and goal-setting sessions</li>
        <li>Time Off Management: Streamline the process of requesting, approving, and tracking employee leave</li>
        <li>Recruitment and Onboarding: Manage job postings, applications, and new employee onboarding processes</li>
        <li>Training and Development: Plan and track employee training programs and career development initiatives</li>
        <li>Compliance Management: Ensure adherence to labor laws and company policies</li>
        <li>Reporting and Analytics: Generate insightful reports on various HR metrics for data-driven decision making</li>
      </ul>
      <h2>Benefits of Using UnDB's HR Management Template</h2>
      <p>Implementing our HR Management template can bring numerous advantages to your organization:</p>
      <ul>
        <li>Increased Efficiency: Automate routine HR tasks and streamline workflows</li>
        <li>Improved Data Accuracy: Centralize employee information and reduce errors in record-keeping</li>
        <li>Enhanced Employee Experience: Provide self-service options for employees to access their information</li>
        <li>Better Decision Making: Leverage HR analytics to make informed strategic decisions</li>
        <li>Scalability: Easily adapt the template to your growing organization's needs</li>
        <li>Cost Savings: Reduce administrative overhead and optimize resource allocation</li>
      </ul>
      <p>Start transforming your HR processes today with UnDB's comprehensive HR Management template!</p>
    `,
    template: {
      type: "base",
      template: templates.hr as IBaseTemplateDTO,
    },
  },
]

if (env.NODE_ENV === "development") {
  templateData.unshift({
    id: "test",
    icon: "💼",
    name: "Test",
    categories: ["sales"],
    description: "A template for testing",
    template: {
      type: "base",
      template: templates.test as IBaseTemplateDTO,
    },
  })
}
