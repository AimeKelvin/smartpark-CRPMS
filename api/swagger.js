import swaggerJSDoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: { title: 'CRPMS API', version: '1.0.0', description: 'Car Repair Payment Management System API' },
  },
  apis: ['./routes/*.js'],
};

export default swaggerJSDoc(options);
