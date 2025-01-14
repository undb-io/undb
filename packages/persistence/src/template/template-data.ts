import { env } from "@undb/env"
import { templates, type IBaseTemplateDTO, type ITemplateDTO } from "@undb/template"

function getTemplateImage(folder: string, file: string) {
  return env.UNDB_BASE_URL + "/assets/templates/" + folder + "/" + file
}

export const templateData: ITemplateDTO[] = [
  {
    id: "6ba7b815-9dad-11d1-80b4-00c04fd430c8",
    icon: "👨‍👧‍👦",
    name: "Human Resource Management",
    categories: ["hr"],
    cover: getTemplateImage("hr", "cover.jpg"),
    images: [
      getTemplateImage("hr", "image1.png"),
      getTemplateImage("hr", "image2.png"),
      getTemplateImage("hr", "image3.png"),
      getTemplateImage("hr", "image4.png"),
      getTemplateImage("hr", "image5.png"),
    ],
    description: "A template for managing human resources, including employees, positions, and departments.",
    detail: `
    <h1>UnDB Human Resource Management Template: Streamline Your HR Processes</h1>

<h2>Comprehensive HR Management Features for Modern Businesses</h2>

<p>UnDB's Human Resource Management template offers a powerful set of tools to revolutionize your HR operations:</p>

<h3>Employee Management System</h3>
<ul>
  <li>Create and maintain detailed employee profiles</li>
  <li>Track positions, departments, salaries, and employment status</li>
  <li>Manage organizational hierarchy with reporting structures</li>
</ul>

<h3>Department and Payroll Administration</h3>
<ul>
  <li>Organize company departments with budget and location tracking</li>
  <li>Administer payroll, including salaries, bonuses, and deductions</li>
  <li>Automate net pay calculations for efficient processing</li>
</ul>

<h3>Leave Management and Performance Evaluation</h3>
<ul>
  <li>Streamline time-off requests with customizable leave types</li>
  <li>Conduct regular performance reviews with rating systems</li>
  <li>Set and track employee goals for career development</li>
</ul>

<h2>Benefits of UnDB's HR Software Template</h2>

<p>Transform your human resources processes with our comprehensive solution:</p>

<ul>
  <li>Centralized HR Data Management</li>
  <li>Improved Operational Efficiency</li>
  <li>Enhanced Organizational Visibility</li>
  <li>Scalable and Customizable Platform</li>
  <li>Data-Driven HR Decision Making</li>
</ul>

<h2>HR Template Structure</h2>

<p>Our HR management system includes five key components:</p>

<ol>
  <li>Employees Database</li>
  <li>Departments Tracker</li>
  <li>Payroll Management System</li>
  <li>Time Off Request Platform</li>
  <li>Performance Review Module</li>
</ol>

<h2>Getting Started with UnDB's HR Template</h2>

<p>Follow these steps to implement our HR solution:</p>

<ol>
  <li>Import the HR template to your UnDB workspace</li>
  <li>Customize fields and views to match your organization</li>
  <li>Input employee and department data</li>
  <li>Configure leave request and performance review workflows</li>
  <li>Start tracking payroll and departmental budgets</li>
</ol>

<h2>Frequently Asked Questions</h2>

<h3>Q: Is UnDB's HR template suitable for small businesses?</h3>
<p>A: Yes, our template is scalable and can be customized for businesses of all sizes.</p>

<h3>Q: Can I integrate this template with other HR tools?</h3>
<p>A: UnDB offers various integration options. Contact our support team for specific integration queries.</p>

<h3>Q: How secure is the employee data in this system?</h3>
<p>A: We prioritize data security with encryption and access controls. </p>

<p>Transform your HR processes today with UnDB's comprehensive Human Resource Management template!</p>

    `,
    template: {
      type: "base",
      template: templates.hr as IBaseTemplateDTO,
    },
  },
  {
    id: "6ba7b816-9dad-11d1-80b4-00c04fd430c8",
    icon: "🔍",
    name: "Agile Development Management",
    categories: ["development", "agile", "startup"],
    cover: getTemplateImage("agileDevelopment", "cover.jpg"),
    images: [
      getTemplateImage("agileDevelopment", "image1.png"),
      getTemplateImage("agileDevelopment", "image2.png"),
      getTemplateImage("agileDevelopment", "image3.png"),
    ],
    description: "A template for managing agile development projects, including requirements, tasks, and defects.",
    detail: `
      <h1>Optimize Your Agile Development Process: UnDB's Agile Development Management Template</h1>

      <h2>Comprehensive Agile Development Management Features</h2>
      <p>UnDB's Agile Development Management template offers a powerful set of tools to enhance your agile development process:</p>
      <ul>
        <li>Requirements Management: Easily create, assign, and track project requirements</li>
        <li>Task Tracking: Efficiently manage and monitor development tasks</li>
        <li>Defect Management: Track and resolve software defects</li>
        <li>Iteration Planning: Plan and manage sprints or iterations</li>
        <li>Test Case Management: Create and execute test cases</li>
        <li>Team Management: Organize and track team members' contributions</li>
        <li>Time Tracking: Monitor time spent on tasks and projects</li>
      </ul>

      <h2>Why Choose UnDB for Agile Development Management?</h2>
      <p>UnDB offers unique advantages for your agile development needs:</p>
      <ul>
        <li>Customizable: Tailor the template to fit your specific agile methodology and project requirements</li>
        <li>User-Friendly: Intuitive interface for easy adoption across your development team</li>
        <li>Scalable: Grows with your projects, from small teams to large-scale development efforts</li>
        <li>Integration-Ready: Seamlessly connects with other UnDB templates and tools</li>
        <li>Data-Driven: Make informed decisions with real-time project insights and analytics</li>
      </ul>

      <h2>Getting Started with UnDB's Agile Development Template</h2>
      <p>Follow these steps to implement our agile development solution:</p>
      <ol>
        <li>Import the Agile Development template to your UnDB workspace</li>
        <li>Customize fields and views to match your team's agile processes</li>
        <li>Input your project requirements and create initial tasks</li>
        <li>Set up iterations or sprints and assign team members</li>
        <li>Start tracking progress, managing defects, and monitoring team performance</li>
      </ol>

      <p>Transform your agile development process today with UnDB's comprehensive Agile Development Management template!</p>
    `,
    template: {
      type: "base",
      template: templates.agileDevelopment as IBaseTemplateDTO,
    },
  },
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
    id: "6ba7b812-9dad-11d1-80b4-00c04fd430c8",
    icon: "💼",
    name: "Remote Work Management",
    categories: ["development", "hr"],
    cover: getTemplateImage("remoteWorkManagement", "cover.jpg"),
    images: [
      getTemplateImage("remoteWorkManagement", "image1.png"),
      getTemplateImage("remoteWorkManagement", "image2.png"),
    ],
    description: "A template for managing remote workers, including tasks, time tracking, and equipment inventory.",
    detail: `
      <h1>UnDB Remote Work Management Template: Optimize Your Distributed Team Operations</h1>

      <h2>Comprehensive Remote Work Management Features for Modern Organizations</h2>

      <p>UnDB's Remote Work Management template provides essential tools to effectively manage distributed teams:</p>

      <h3>Remote Employee Management</h3>
      <ul>
        <li>Track remote worker profiles, time zones, and work schedules</li>
        <li>Manage virtual team structures and reporting relationships</li>
        <li>Monitor remote employee performance and productivity</li>
      </ul>

      <h3>Time and Project Tracking</h3>
      <ul>
        <li>Record work hours across different time zones</li>
        <li>Track project progress and task completion</li>
        <li>Generate detailed productivity reports</li>
      </ul>

      <h3>Equipment and Resource Management</h3>
      <ul>
        <li>Track company equipment assigned to remote workers</li>
        <li>Manage software licenses and digital resources</li>
        <li>Monitor equipment maintenance and updates</li>
      </ul>

      <h3>Virtual Communication Tools</h3>
      <ul>
        <li>Schedule and track virtual meetings and team events</li>
        <li>Facilitate remote team collaboration</li>
        <li>Maintain clear communication channels</li>
      </ul>
    `,
    template: {
      type: "base",
      template: templates.remoteWorkManagement as IBaseTemplateDTO,
    },
  },
]

templateData.unshift({
  id: "everything",
  icon: "💼",
  name: "Everything",
  categories: ["sales"],
  description: "A template for testing",
  template: {
    type: "base",
    template: templates.everything as IBaseTemplateDTO,
  },
})
