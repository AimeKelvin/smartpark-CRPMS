const bcrypt = require('bcrypt');

/**
 * SmartPark CRPMS Demo Data Seed Script
 * Generates realistic demo data for testing and demonstration
 */

async function seedDemoData(db) {
  console.log('🌱 Starting demo data seed...');
  try {
    // 1. Create demo admin user
    console.log('Creating demo user...');
    const hashedPassword = await bcrypt.hash('admin123', 10);
    await db.query(`
      INSERT INTO User (Username, Password, Email, Role) 
      VALUES (?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE Password = VALUES(Password)
    `, ['admin', hashedPassword, 'admin@smartpark.rw', 'admin']);

    // 2. Insert demo cars
    console.log('Inserting demo cars...');
    const demoCars = [['RAD 123 A', 'Sedan', 'Toyota Corolla', 2020, '+250788123456', 'Jean Paul Mugabo'], ['RAD 456 B', 'SUV', 'Toyota RAV4', 2019, '+250788234567', 'Marie Claire Uwase'], ['RAD 789 C', 'Truck', 'Isuzu D-Max', 2021, '+250788345678', 'Jean Paul Mugabo'], ['RAD 234 D', 'Sedan', 'Honda Civic', 2018, '+250788456789', 'Eric Nshimiyimana'], ['RAD 567 E', 'Hatchback', 'Volkswagen Golf', 2022, '+250788567890', 'Marie Claire Uwase'], ['RAD 890 F', 'SUV', 'Nissan X-Trail', 2020, '+250788678901', 'Jean Paul Mugabo'], ['RAD 345 G', 'Sedan', 'Mazda 3', 2019, '+250788789012', 'Eric Nshimiyimana'], ['RAD 678 H', 'Pickup', 'Ford Ranger', 2021, '+250788890123', 'Marie Claire Uwase']];
    for (const car of demoCars) {
      await db.query(`
        INSERT INTO Car (PlateNumber, Type, Model, ManufacturingYear, DriverPhone, MechanicName)
        VALUES (?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE Model = VALUES(Model)
      `, car);
    }

    // 3. Insert service records (spanning last 30 days)
    console.log('Inserting service records...');
    const today = new Date();
    const serviceRecords = [
    // Recent services (last 7 days)
    [formatDate(today), 'RAD 123 A', 'SVC003'],
    // Oil change today
    [formatDate(today), 'RAD 456 B', 'SVC006'],
    // Wheel alignment today
    [formatDate(subtractDays(today, 1)), 'RAD 789 C', 'SVC001'],
    // Engine repair yesterday
    [formatDate(subtractDays(today, 2)), 'RAD 234 D', 'SVC004'],
    // Chain replacement
    [formatDate(subtractDays(today, 3)), 'RAD 567 E', 'SVC003'],
    // Oil change
    [formatDate(subtractDays(today, 5)), 'RAD 890 F', 'SVC002'],
    // Transmission repair
    [formatDate(subtractDays(today, 6)), 'RAD 345 G', 'SVC006'],
    // Wheel alignment

    // Last 2 weeks
    [formatDate(subtractDays(today, 10)), 'RAD 678 H', 'SVC005'],
    // Disc replacement
    [formatDate(subtractDays(today, 12)), 'RAD 123 A', 'SVC004'],
    // Chain replacement
    [formatDate(subtractDays(today, 14)), 'RAD 456 B', 'SVC001'],
    // Engine repair

    // Last month
    [formatDate(subtractDays(today, 20)), 'RAD 789 C', 'SVC003'],
    // Oil change
    [formatDate(subtractDays(today, 22)), 'RAD 234 D', 'SVC006'],
    // Wheel alignment
    [formatDate(subtractDays(today, 25)), 'RAD 567 E', 'SVC002'],
    // Transmission repair
    [formatDate(subtractDays(today, 28)), 'RAD 890 F', 'SVC003'] // Oil change
    ];
    for (const record of serviceRecords) {
      await db.query(`
        INSERT INTO ServiceRecord (ServiceDate, PlateNumber, ServiceCode)
        VALUES (?, ?, ?)
      `, record);
    }

    // 4. Insert payments (some partial, some full)
    console.log('Inserting payment records...');
    const payments = [
    // Full payments
    [60000, formatDate(today), 'RAD 123 A'],
    // Paid for oil change
    [5000, formatDate(today), 'RAD 456 B'],
    // Paid for wheel alignment
    [100000, formatDate(subtractDays(today, 1)), 'RAD 789 C'],
    // Partial payment for engine repair
    [40000, formatDate(subtractDays(today, 2)), 'RAD 234 D'],
    // Paid for chain replacement
    [60000, formatDate(subtractDays(today, 3)), 'RAD 567 E'],
    // Paid for oil change

    // Partial payments
    [50000, formatDate(subtractDays(today, 5)), 'RAD 890 F'],
    // Partial for transmission
    [5000, formatDate(subtractDays(today, 6)), 'RAD 345 G'],
    // Paid for wheel alignment
    [200000, formatDate(subtractDays(today, 10)), 'RAD 678 H'],
    // Partial for disc replacement

    // Older payments
    [40000, formatDate(subtractDays(today, 12)), 'RAD 123 A'],
    // Paid for chain replacement
    [150000, formatDate(subtractDays(today, 14)), 'RAD 456 B'],
    // Paid for engine repair
    [60000, formatDate(subtractDays(today, 20)), 'RAD 789 C'],
    // Paid for oil change
    [5000, formatDate(subtractDays(today, 22)), 'RAD 234 D'] // Paid for wheel alignment
    ];
    for (const payment of payments) {
      await db.query(`
        INSERT INTO Payment (AmountPaid, PaymentDate, PlateNumber)
        VALUES (?, ?, ?)
      `, payment);
    }
    console.log('✅ Demo data seeded successfully!');
    console.log('\n📋 Demo Credentials:');
    console.log('   Username: admin');
    console.log('   Password: admin123');
    console.log('\n📊 Demo Data Summary:');
    console.log(`   - ${demoCars.length} cars registered`);
    console.log(`   - ${serviceRecords.length} service records`);
    console.log(`   - ${payments.length} payment records`);
    console.log('   - 6 predefined services available');
    return {
      success: true,
      message: 'Demo data loaded successfully',
      stats: {
        cars: demoCars.length,
        serviceRecords: serviceRecords.length,
        payments: payments.length,
        services: 6
      }
    };
  } catch (error) {
    console.error('❌ Error seeding demo data:', error);
    throw error;
  }
}

// Helper functions
function formatDate(date) {
  return date.toISOString().split('T')[0];
}
function subtractDays(date, days) {
  const result = new Date(date);
  result.setDate(result.getDate() - days);
  return result;
}
module.exports = {
  seedDemoData
};