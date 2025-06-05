# Oklahoma Energy Parcel Explorer

An interactive mapping application for exploring oil and gas properties in Oklahoma's SCOOP (South Central Oklahoma Oil Province) region. Built with React and Leaflet to demonstrate modern web mapping capabilities with industry-specific data visualization.

## Features

- **Interactive Map**: Click on energy parcels to view detailed information
- **Real-time Data Display**: Property details, ownership, and lease information
- **Industry-Specific Data**: Oil & gas formations, royalty rates, well counts
- **Mobile Responsive**: Optimized for desktop, tablet, and mobile devices
- **Professional UI**: Clean, modern interface with smooth interactions

## Technologies Used

- **React 18** - Modern JavaScript framework
- **Vite** - Fast build tool and development server
- **Leaflet** - Open-source mapping library
- **OpenStreetMap** - Map tile provider
- **Responsive Design** - Mobile-first approach

## Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- npm or yarn package manager

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/sudosu-dev/parcel-map-demo.git
   cd parcel-map-demo
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:

   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173`

### Building for Production

To create a production build:

```bash
npm run build
```

The built files will be in the `dist` directory.

## Demo Data

This application uses mock data for demonstration purposes. All property information, company names, and lease details are fictional and created to showcase realistic energy industry data structures.

**Sample Data Includes:**

- Property ownership and values
- Acreage and zoning information
- Oil & gas lease terms and royalty rates
- Well counts and formation data
- Legal land descriptions (Section/Township/Range)

## Project Structure

```
src/
├── App.jsx          # Main application component
├── main.jsx         # Application entry point
├── index.css        # Global styles
└── assets/          # Static assets

public/              # Public assets
dist/                # Production build output
```

## Development Process

This project was built over 5 days with the following approach:

1. **Research Phase**: Studied Oklahoma energy industry and SCOOP/STACK plays
2. **Technical Planning**: Selected React + Leaflet for mapping capabilities
3. **Data Modeling**: Created realistic mock data structures for energy properties
4. **Implementation**: Built interactive mapping interface with property details
5. **Mobile Optimization**: Added responsive design for all device sizes

## Key Learning Areas

- Modern React development with hooks and state management
- Third-party library integration (Leaflet mapping)
- Responsive web design principles
- Industry domain research and data modeling
- Interactive UI/UX design patterns

## Future Enhancements

With additional development time, this application could be expanded to include:

- **Real Data Integration**: Connect to Oklahoma Corporation Commission APIs
- **Advanced Filtering**: Search and filter properties by various criteria
- **Data Visualization**: Charts and graphs for production and lease data
- **User Authentication**: Secure access for different user roles
- **Export Functionality**: Generate reports and data exports
- **Real-time Updates**: Live data feeds from industry sources

## Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge

## License

This project is for demonstration purposes. All data is fictional and not intended for commercial use.

## Contact

Built as a portfolio demonstration project showcasing modern web development skills and domain research capabilities.
