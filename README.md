# Agape Project Hub

Ah, entendi. Você não está perguntando só pelo visual. Você quer saber que tipo de sistema é, para decidir como a Amanda vai entrar e trabalhar nele.

O que estamos construindo é um:

🗂️ Project Management / Project Implementation System

Mais especificamente:

AGAPE Project Implementation Hub

É uma espécie de central de gestão e implantação da Chiesa.

Não é simplesmente um calendário. O calendário é uma das visualizações.

A lógica seria:

PROJETO
→ FASES
→ TASKS
→ RESPONSÁVEIS
→ PRAZOS
→ DEPENDÊNCIAS
→ STATUS
→ VALIDAÇÃO
→ APROVAÇÃO
→ ENTREGA

👥 E a Amanda pode ter acesso

Na verdade, faz bastante sentido que ela tenha acesso.

Pelo papel que já definimos para a Amanda — Secretariado & Coordenação, fazendo a gestão entre você e o Pastor — esse sistema pode funcionar justamente como o ponto central de coordenação entre vocês três.

Eu estruturaria assim:

👤 PASTOR

Direção Pastoral & Visão

Vê principalmente:

decisões estratégicas;

aprovações;

visão geral;

checkpoints;

projetos críticos.

👤 AMANDA

Secretariado & Coordenação

É a pessoa que mais utiliza o sistema operacionalmente:

acompanha tarefas;

atualiza prazos;

coordena responsáveis;

registra decisões;

identifica bloqueios;

acompanha aprovações;

organiza reuniões;

faz follow-up;

mantém o projeto andando.

👤 NANY

Implementação / Estratégia / Criativo / Tecnologia

Você trabalha mais diretamente em:

implementação;

branding;

website;

design;

tecnologia;

conteúdo;

execução;

validação técnica/visual.

🧠 O mais interessante

Eu não faria três sistemas separados.

Faria UM sistema, com permissões diferentes.

Por exemplo:

AGAPE PROJECT HUB

                    AGAPE
                      │
             PROJECT HUB
                      │
       ┌──────────────┼──────────────┐
       │              │              │
     PASTOR         AMANDA          NANY
       │              │              │
    Aprovações     Coordenação    Implementação
       │              │              │
       └──────────────┼──────────────┘
                      │
                   TASKS
                      │
       ┌──────────────┼──────────────┐
       │              │              │
     Calendar       Tasks         Timeline

Assim vocês três enxergam a mesma realidade do projeto, mas cada uma pessoa tem uma função diferente.

🎨 E o estilo?

Eu chamaria o estilo de:

Editorial Project Management

Mistura de:

Notion + Linear + Asana + dashboard editorial premium

mas com a identidade AGAPE.

Não quero que pareça um software empresarial frio.

Também não quero que pareça um aplicativo religioso.

A ideia é:

uma ferramenta profissional de gestão que pertence à AGAPE.

Isso é importante porque, futuramente, o mesmo sistema pode administrar:

Website

Branding

Social Media

Eventos

Ministérios

Comunicação

Conteúdo

Tecnologia

Lançamentos

Projetos especiais

🔐 E eu acrescentaria uma coisa

Como a Amanda vai acessar, eu não deixaria esse HTML como sistema final.

O HTML atual é um protótipo visual/prova de conceito.

Para a versão real no Lovable, eu faria:

Login

↓

AGAPE Project Hub

↓

Workspace

↓

Projetos

↓

Tasks

↓

Calendário

↓

Responsáveis

↓

Aprovações

E posteriormente podemos colocar Supabase + autenticação + permissões, para que Pastor, Amanda e Nany tenham acessos diferentes.

Isso também combina muito melhor com a estratégia maior da Plataforma Digital da AGAPE.

Minha recomendação: não chamar isso simplesmente de "Planner".
Eu usaria AGAPE Project Hub ou AGAPE Implementation Hub.

Pronto. Fiz a nova versão pensando especificamente em Calendar + Tasks, para você enviar ao Lovable.

📅 Estrutura do layout

A interface tem um estilo de project management premium, mas mantendo a linguagem visual da AGAPE:

Fundo: cinza-claro neutro, com o sistema dentro de um grande container arredondado.

Base: Cream #F1EEE4.

Navy AGAPE: #092A3C para ações principais e destaque.

Charcoal: #242426 para navegação e textos fortes.

Mineral Green: #3B4639 para estados positivos.

Amarelo-lima: usado apenas como acento de prioridade.

Cards brancos, bordas finas e sombras muito discretas.

Cantos arredondados, mas sem aparência excessivamente “app infantil”.

Tipografia limpa, contemporânea e bastante espaço negativo.

🗓️ Calendar

O centro da interface é um calendário mensal, onde cada dia pode conter várias tasks.

As tasks aparecem como pequenos blocos:

🔵 Website

🟢 Branding

🟠 Audiovisual

🟡 Lançamento

E cada task possui status visual.

✅ Task Manager

Ao clicar em uma task abre um painel lateral com:

nome

prazo

status

dependência

critério de validação

espaço para decisões/notas

Isso segue exatamente a lógica do Implantador de Projetos:

Task → Dependência → Implementação → Validação → Conclusão

🎯 Homepage

A Homepage recebe um destaque especial no topo:

28/09 → Implementação
29/09 → Visual + responsividade
30/09 → Teste + validação

Assim o Lovable entende que ela é a prioridade operacional imediata, e não apenas mais uma tarefa.

📊 Também deixei preparado

Calendar

Tasks

Timeline

filtros/visões

status

prioridade

checkpoints

dependências

validação

lançamento

Arquivo para enviar ao Lovable:

Baixar AGAPE Project Calendar + Tasks HTML

Observação: o conteúdo e os prazos foram cruzados com o planejamento que temos nesta conversa; onde as datas não eram decisões oficiais, tratei-as como prazos propostos, não como fatos já aprovados.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/188fd8af-6649-4137-83d4-0527dca1a444).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
