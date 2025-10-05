import { DataSource } from 'typeorm';
import { ulid } from 'ulid';

// Configuração do banco de dados
const dataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'tiny_shop',
  synchronize: false,
  logging: true,
});

async function updateAddressIds() {
  try {
    console.log('Conectando ao banco de dados...');
    await dataSource.initialize();
    console.log('✅ Conectado ao banco de dados');

    // Buscar todos os endereços
    console.log('Buscando endereços...');
    const addresses = await dataSource.query(
      'SELECT id, address_id FROM address ORDER BY id',
    );
    console.log(`📋 Encontrados ${addresses.length} endereços`);

    if (addresses.length === 0) {
      console.log('ℹ️  Nenhum endereço encontrado');
      return;
    }

    // Mostrar endereços atuais
    console.log('\n📊 Endereços atuais:');
    addresses.forEach((addr: any, index: number) => {
      console.log(
        `${index + 1}. ID: ${addr.id}, address_id: ${addr.address_id}`,
      );
    });

    // Gerar novos ULIDs e atualizar
    console.log('\n🔄 Gerando novos ULIDs...');

    type AddressUpdate = {
      id: number;
      newUlid: string;
      oldAddressId: string;
    };

    const updates: AddressUpdate[] = [];

    for (const address of addresses) {
      const newUlid = ulid();
      const update: AddressUpdate = {
        id: address.id,
        newUlid,
        oldAddressId: address.address_id,
      };
      updates.push(update);
    }

    // Executar atualizações
    console.log('\n💾 Atualizando endereços...');
    for (const update of updates) {
      await dataSource.query(
        'UPDATE address SET address_id = $1 WHERE id = $2',
        [update.newUlid, update.id],
      );
      console.log(
        `✅ ID ${update.id}: ${update.oldAddressId} → ${update.newUlid}`,
      );
    }

    // Verificar resultado
    console.log('\n🔍 Verificando resultado...');
    const updatedAddresses = await dataSource.query(
      'SELECT id, address_id FROM address ORDER BY id',
    );

    console.log('\n📊 Endereços atualizados:');
    updatedAddresses.forEach((addr: any, index: number) => {
      console.log(
        `${index + 1}. ID: ${addr.id}, address_id: ${addr.address_id}`,
      );
    });

    console.log(
      '\n✅ Todos os address_id foram atualizados com ULIDs válidos!',
    );
  } catch (error) {
    console.error('❌ Erro ao atualizar endereços:', error);
    throw error;
  } finally {
    if (dataSource.isInitialized) {
      await dataSource.destroy();
      console.log('🔌 Conexão com banco de dados encerrada');
    }
  }
}

// Executar o script
if (require.main === module) {
  updateAddressIds()
    .then(() => {
      console.log('🎉 Script executado com sucesso!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Erro na execução:', error);
      process.exit(1);
    });
}

export { updateAddressIds };
