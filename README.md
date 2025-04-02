# EZViz - Modern Data Analytics Platform

EZViz is a lightweight analytics platform designed to help businesses connect to their data warehouse, analyze their data, and build interactive workbooks and dashboards. With a clean, intuitive interface, EZViz makes it easy for users of all technical levels to gain insights from their data.

![EZViz Demo](https://via.placeholder.com/800x450.png?text=EZViz+Dashboard)

## Features

### Data Connectivity
- **Snowflake Integration**: Connect directly to your Snowflake data warehouse
- **Schema Explorer**: Browse database schemas, tables, and columns
- **Live Query**: Work with live data instead of imports or extracts

### Workbooks
- **Multi-page Workbooks**: Create workbooks with multiple tabs for organizing your analysis
- **Interactive Tables**: View and explore your data in a spreadsheet-like interface
- **Interactive Controls**: Filter, sort, and manipulate data with intuitive controls
- **Visualizations**: Create charts and visualizations to better understand your data

### User Experience
- **Modern UI**: Clean, responsive interface built with modern web technologies
- **Collaboration**: Share workbooks and dashboards with team members
- **Export Options**: Download data as CSV or export visualizations

### Development Features
- **TypeScript**: Fully typed codebase for better developer experience
- **Component Library**: Reusable UI components for building custom visualizations
- **API Integration**: RESTful API for programmatic access to data

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Access to a Snowflake account with appropriate permissions

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/EZViz.git
cd EZViz
```

2. Install dependencies
```bash
npm install
# or
yarn install
```

3. Configure environment variables (create a `.env.local` file):
```
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

4. Start the development server
```bash
npm run dev
# or
yarn dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

### Connecting to Snowflake

EZViz requires the following Snowflake connection parameters:

- Account: Your Snowflake account identifier (e.g., `xy12345.us-east-1`)
- Username: Your Snowflake username
- Password: Your Snowflake password
- Warehouse: The compute warehouse to use
- Database: The database to connect to
- Schema (optional): The schema to use (defaults to PUBLIC)
- Role (optional): The role to use for queries

## Architecture

EZViz is built with a modern stack that prioritizes performance, maintainability, and developer experience:

### Frontend
- **Next.js**: React framework with server-side rendering capabilities
- **TypeScript**: Type-safe JavaScript for better reliability
- **TailwindCSS**: Utility-first CSS framework for consistent styling
- **React Query**: Data fetching and state management
- **React Table**: Flexible and extensible data tables

### Backend
- **Next.js API Routes**: Serverless functions for backend logic
- **Snowflake Node.js Driver**: Official Snowflake SDK for Node.js

### Key Components
- **Connection Management**: Secure storage and retrieval of database connections
- **Query Engine**: Efficient SQL generation and execution
- **Workbook System**: Interactive data exploration environment
- **Visualization Layer**: Configurable charts and graphs

## Development

### Project Structure

```
EZViz/
├── app/                  # Next.js application
│   ├── api/              # API routes
│   │   └── snowflake/    # Snowflake API endpoints
│   ├── components/       # React components
│   └── lib/              # Utilities and types
├── public/               # Static assets
└── next.config.js        # Next.js configuration
```

### Key Components

- **Dashboard.tsx**: Main workbook interface
- **Sidebar.tsx**: Navigation and schema explorer
- **TableView.tsx**: Table display component
- **WorkbookDemo.tsx**: Dashboard demo component
- **ConnectionForm.tsx**: Snowflake connection form

### Running Tests

```bash
npm test
# or
yarn test
```

## Deployment

### Production Build

```bash
npm run build
npm start
# or
yarn build
yarn start
```

### Containerization

A Dockerfile is included for containerizing the application:

```bash
docker build -t ezviz .
docker run -p 3000:3000 ezviz
```

## Roadmap

- Advanced visualization types
- Saved views and bookmarks
- User authentication and access control
- Custom SQL editor
- Data modeling layer
- Embedded analytics
- Mobile app

## Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for details on how to submit pull requests, report issues, and suggest features.

## License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

## Support

For support, please open an issue on the GitHub repository or contact the maintainers directly. 