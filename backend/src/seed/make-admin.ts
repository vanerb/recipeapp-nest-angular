import { NestFactory } from '@nestjs/core';
import { DataSource } from 'typeorm';
import { AppModule } from 'src/app.module';
import { User } from 'src/users/users.entity';

// Convierte una cuenta existente en administración: npm run make-admin -- correo@ejemplo.com
async function makeAdmin() {
  const email = process.argv[2]?.toLowerCase();
  if (!email) {
    console.error('Indica el correo: npm run make-admin -- correo@ejemplo.com');
    process.exitCode = 1;
    return;
  }

  const app = await NestFactory.createApplicationContext(AppModule, {
    logger: ['error'],
  });
  const users = app.get(DataSource).getRepository(User);
  const user = await users.findOneBy({ email });

  if (user) {
    await users.update(user.id, { role: 'admin', isBlocked: false });
    console.log(`${user.name} (${email}) ya es administración.`);
  } else {
    console.error(`No hay ninguna cuenta con el correo ${email}.`);
    process.exitCode = 1;
  }
  await app.close();
}

makeAdmin();
