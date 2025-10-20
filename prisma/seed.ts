import {PrismaClient} from "@prisma/client";

const prisma = new PrismaClient();

async function main(){
  console.log("Iniciando o seeding...");

  await prisma.funcionario.deleteMany();
  console.log('Todos os registros de funcionários foram deletados.');

  await prisma.funcionario.create({
    data: {
      nome: "João Silva",
      email: "joao.silva@example.com",
      cargo: "Desenvolvedor",
      setor: "Tecnologia",
      telefone: "11999999999"
    }
  });

  await prisma.funcionario.create({
    data: {
      nome: "Maria Oliveira",
      email: "maria.oliveira@example.com",
      cargo: "Analista de Marketing",
      setor: "Marketing",
      telefone: "21988888888"
    }
  })

  await prisma.funcionario.create({
    data: {
      nome: "Carlos Souza",
      email: "carlos.souza@example.com",
      cargo: "Gerente de Vendas",
      setor: "Vendas",
      telefone: "31977777777"
    }
  })

  await prisma.funcionario.create({
    data: {
      nome: "Ana Pereira",
      email: "ana.pereira@example.com",
      cargo: "Designer Gráfico",
      setor: "Design",
      telefone: "41966666666"
    }
  })

  console.log("Cadastro de usuários através da seed concluído com sucesso!")
}

main()
  .catch((e)=>{
    console.error(e);
    process.exit(1)
  })
  .finally( async ()=>{
    await prisma.$disconnect();
  });