# Documentação do Sistema de Agendamento

## Visão geral

O sistema será uma plataforma de agendamento online voltada para profissionais autônomos e pequenos negócios informais, como:

* Barbeiros;
* Manicures;
* Cabeleireiros;
* Esteticistas;
* Tatuadores;
* Entre outros profissionais que trabalham com atendimento por horário.

A proposta é permitir que esses profissionais criem uma página personalizada para divulgar seus serviços, receber agendamentos e organizar sua rotina de atendimento de forma simples, rápida e prática.

O sistema está sendo desenvolvido com:

* **Nuxt 4**
* **Prisma**

---

## Objetivo principal

O objetivo do sistema é oferecer uma solução simples e acessível para profissionais autônomos organizarem seus horários, divulgarem seus serviços e receberem agendamentos online sem depender de processos manuais ou ferramentas complexas.

A plataforma deve priorizar:

* Facilidade de uso;
* Personalização da página pública;
* Controle de horários disponíveis;
* Suporte a colaboradores;
* Integração prática com WhatsApp;
* Agendamento sem cadastro obrigatório para o cliente.

---

## Tipos de usuários

A plataforma terá, inicialmente, três tipos principais de usuários:

### Dono do estabelecimento

É o usuário responsável por criar e gerenciar o estabelecimento dentro da plataforma.

O dono poderá:

* Configurar os dados do estabelecimento;
* Cadastrar serviços;
* Definir horários de funcionamento;
* Adicionar colaboradores, conforme o plano contratado;
* Visualizar agendamentos;
* Acompanhar o faturamento geral;
* Acessar relatórios mais completos sobre o desempenho do negócio.

---

### Colaborador

O colaborador será um profissional vinculado a um estabelecimento.

Ele poderá acessar a plataforma para visualizar apenas as informações relacionadas aos serviços atribuídos a ele.

O colaborador poderá:

* Ver os próprios agendamentos;
* Visualizar os serviços vinculados a ele;
* Acompanhar o faturamento gerado pelos atendimentos realizados por ele.

O colaborador não terá acesso completo aos dados do estabelecimento, relatórios gerais ou faturamento total, pois essas informações serão exclusivas do dono.

---

### Cliente

O cliente será a pessoa que acessa a página pública do estabelecimento para realizar um agendamento.

Inicialmente, o cliente não precisará criar uma conta obrigatoriamente para agendar um serviço. O processo será simples e direto, com foco em facilitar o agendamento pelo celular.

---

## Fluxo de cadastro do profissional

O profissional acessa a plataforma e cria sua conta informando:

* Nome;
* Sobrenome;
* E-mail;
* Senha.

Após realizar o primeiro login, o usuário passa por um processo de onboarding para configurar seu estabelecimento ou perfil profissional.

Durante o onboarding, ele deverá informar os principais dados do negócio, como:

* Nome do estabelecimento ou empresa;
* Tipo de atuação, por exemplo:

  * Barbeiro;
  * Cabeleireiro;
  * Manicure;
  * Tatuador;
  * Esteticista;
  * Entre outros;
* Slug personalizado;
* Logotipo;
* Banner;
* Descrição do estabelecimento;
* Cor primária da identidade visual;
* Canais de divulgação e contato, como:

  * WhatsApp;
  * Instagram;
  * Facebook;
  * Outros canais.

---

## Slug e domínio personalizado

Durante o onboarding, o profissional deverá escolher um slug exclusivo para sua página pública.

Esse slug será usado para gerar um subdomínio dinâmico dentro da plataforma.

Exemplo:

```txt
barbeirando.agendai.com.br
```

Nesse caso, `barbeirando` é o slug escolhido pelo usuário.

Em planos superiores, como o plano Premium, poderá existir a opção de utilizar um domínio próprio.

Exemplo:

```txt
www.barbeariadofulano.com.br
```

Essa funcionalidade ainda poderá ser estudada com mais detalhes futuramente, especialmente em relação à configuração de DNS, validação de domínio e regras por plano.

---

## Configuração dos horários de funcionamento

O profissional poderá configurar os horários de funcionamento do estabelecimento, definindo:

* Dias da semana em que atende;
* Horário de abertura;
* Horário de fechamento;
* Pausas durante o dia, como intervalo para almoço.

Exemplo:

```txt
Segunda-feira:
Aberto das 08h às 18h
Pausa para almoço das 12h às 13h

Domingo:
Fechado
```

Essas informações serão utilizadas para controlar os horários disponíveis para agendamento.

O sistema deverá impedir conflitos de horário, evitando que dois clientes consigam agendar o mesmo serviço, profissional ou horário ao mesmo tempo.

---

## Cadastro de serviços

Ao final do onboarding, o profissional deverá cadastrar pelo menos um serviço.

Cada serviço poderá conter:

* Nome;
* Descrição;
* Imagem ou ilustração;
* Tempo estimado de duração;
* Valor;
* Profissional ou colaborador responsável pelo serviço, quando houver colaboradores cadastrados.

De acordo com o tipo de estabelecimento selecionado, o sistema poderá disponibilizar ilustrações padrão para os serviços.

Dessa forma, caso o usuário não queira enviar uma imagem própria, poderá utilizar uma das opções oferecidas pela plataforma.

---

## Página pública de agendamento

Após concluir a configuração inicial, o profissional terá uma página pública personalizada, acessível por meio do seu subdomínio.

Quando um cliente entrar em contato pelo WhatsApp solicitando um horário, o profissional poderá enviar o link da sua página de agendamento.

Na página, o cliente poderá:

* Acessar a página personalizada do profissional ou estabelecimento;
* Clicar em “Agendar”;
* Escolher o serviço desejado;
* Escolher o profissional responsável pelo atendimento, quando houver mais de um;
* Selecionar o dia e o horário disponível;
* Preencher as informações necessárias para concluir a solicitação.

A ordem do fluxo poderá ser ajustada conforme a experiência desejada, permitindo que o cliente escolha primeiro o serviço e depois o profissional, ou o profissional e depois o serviço.

---

## Confirmação do agendamento via WhatsApp

Após o cliente preencher o formulário de agendamento, o sistema irá gerar um código único para o agendamento.

Esse código funcionará como uma identificação do agendamento dentro da plataforma.

Em seguida, o cliente será redirecionado para o WhatsApp do profissional com uma mensagem personalizada e pré-preenchida.

Exemplo de mensagem:

```txt
Olá, Fulano! Estou entrando em contato para confirmar o agendamento do serviço [nome do serviço] no dia [data] às [horário].

Código do agendamento: [código único]
```

Esse código será gerado automaticamente pelo sistema com base nas informações do agendamento, como data, horário e outros dados relevantes.

O código servirá para:

* Identificar o agendamento na plataforma;
* Consultar o status do agendamento;
* Permitir que o cliente visualize seu agendamento ao retornar ao site;
* Permitir reagendamento com base no código gerado;
* Facilitar a confirmação entre cliente e profissional pelo WhatsApp.

Inicialmente, o agendamento será confirmado por meio da interação via WhatsApp, tornando o processo simples e acessível tanto para o profissional quanto para o cliente.

---

## Controle do agendamento pelo navegador

Como o cliente não precisará criar uma conta obrigatoriamente na primeira versão, o sistema poderá armazenar informações básicas do agendamento no `localStorage` do navegador.

Dessa forma, caso o cliente volte ao site posteriormente, o sistema poderá buscar os dados salvos localmente e exibir informações sobre o agendamento realizado, como:

* Serviço escolhido;
* Data;
* Horário;
* Profissional responsável;
* Código do agendamento;
* Status do agendamento.

Essa abordagem não é totalmente segura, pois os dados ficam armazenados no navegador do usuário.

No entanto, ela pode ser útil para uma primeira versão do sistema, oferecendo praticidade e uma experiência mais simples para o cliente.

Em versões futuras, o cliente poderá criar uma conta ou fazer login com Google para acessar recursos adicionais com mais segurança, como:

* Histórico de agendamentos;
* Pacotes de serviços;
* Reagendamentos;
* Acompanhamento de status.

---

## Reagendamento

O cliente poderá reagendar um atendimento utilizando o código único gerado no momento do agendamento.

Com base nesse código, o sistema poderá localizar o agendamento e permitir que o cliente escolha uma nova data ou horário disponível.

O sistema também deverá validar novamente a disponibilidade do profissional, garantindo que o novo horário não esteja ocupado por outro agendamento.

---

## Colaboradores do estabelecimento

O dono do estabelecimento poderá adicionar colaboradores que também realizam serviços.

Cada colaborador poderá ser vinculado a serviços específicos.

Dessa forma, ao acessar a plataforma, o colaborador verá apenas os serviços e agendamentos atribuídos a ele.

O colaborador também poderá acompanhar o faturamento relacionado aos atendimentos que ele mesmo realizou.

Já o dono do estabelecimento terá uma visão mais completa, podendo visualizar:

* Todos os colaboradores;
* Todos os serviços;
* Todos os agendamentos;
* Faturamento geral;
* Faturamento por colaborador;
* Relatórios administrativos;
* Dados gerais do estabelecimento.

Tanto os donos quanto os colaboradores poderão fazer login utilizando:

* E-mail e senha;
* Conta Google.

Futuramente, também poderá ser adicionada a opção de login com Apple.

---

## Planos da plataforma

A plataforma terá três tipos de planos:

* Free;
* Pro;
* Premium.

As regras exatas de cada plano ainda poderão ser refinadas futuramente, mas a ideia inicial é organizar as funcionalidades da seguinte forma:

---

### Plano Free

O plano Free será uma opção inicial para profissionais que desejam testar ou utilizar a plataforma com recursos limitados.

Possíveis limitações do plano Free:

* Não poderá adicionar colaboradores;
* Terá quantidade limitada de serviços cadastrados;
* Terá acesso limitado a relatórios;
* Usará apenas o subdomínio padrão da plataforma;
* Poderá ter limitações em recursos avançados de personalização.

---

### Plano Pro

O plano Pro será voltado para profissionais ou pequenos estabelecimentos que precisam de mais recursos.

Possíveis recursos do plano Pro:

* Permitir adicionar colaboradores;
* Permitir cadastro ilimitado de serviços;
* Acesso a relatórios mais completos;
* Mais recursos de personalização;
* Melhor controle de agenda e faturamento.

---

### Plano Premium

O plano Premium será o plano mais completo da plataforma.

Possíveis recursos do plano Premium:

* Todos os recursos do plano Pro;
* Uso de domínio próprio;
* Recursos avançados de relatórios;
* Maior nível de personalização;
* Funcionalidades exclusivas futuras.

As funcionalidades exatas de cada plano ainda serão estudadas com mais detalhes antes da implementação final.

---

## Recursos futuros

Algumas funcionalidades poderão ser adicionadas em versões futuras, como:

* Login do cliente com Google;
* Login com Apple;
* Pacotes de serviços;
* Histórico de agendamentos do cliente;
* Controle avançado de permissões para colaboradores;
* Confirmação automática de agendamentos;
* Notificações por e-mail, WhatsApp ou outros canais;
* Gestão financeira básica;
* Relatórios de atendimentos e faturamento;
* Domínio próprio no plano Premium;
* Integrações com meios de pagamento;
* Regras avançadas de cancelamento e reagendamento.

---

## Considerações importantes

Na primeira versão, o sistema poderá priorizar simplicidade e velocidade de uso, especialmente para o cliente final.

Por isso, o cliente poderá realizar agendamentos sem criar uma conta obrigatória. O controle inicial poderá ser feito por meio do código único do agendamento e de dados salvos no `localStorage`.

Apesar dessa abordagem não ser a mais segura, ela pode ser útil para validar a experiência inicial da plataforma.

Em versões futuras, o sistema poderá evoluir para um controle mais robusto com autenticação do cliente, histórico de agendamentos e recursos adicionais.
