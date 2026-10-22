// 1. Variáveis de estado global
// Array de objetos: representa o acervo da biblioteca
const categoriasAcervo = [
    { nome: "Literaturas", totalExemplares: 50, emprestados: 35 },
    { nome: "Ciências", totalExemplares: 30, emprestados: 20 },
    { nome: "História", totalExemplares: 40, emprestados: 30 },
    { nome: "Tecnologia", totalExemplares: 20, emprestados: 15 },
    { nome: "Infantil", totalExemplares: 35, emprestados: 28 },
    { nome: "Outros", totalExemplares: 30, emprestados: 22 }
];
const mesAnalise = "Outubro de 2026";
const valorReferencia = 25; //Meta de corte para saber se uma categoria teve "alto movimento"

// 2. Funções de Cálculo

function calcularTotalEmprestimos(categorias) {
    //reduce() percorre o array acumulado a propriedade 'emprestados' de cada categoria
    return categorias.reduce((soma, cat) => soma + cat.emprestados, 0);
}

function calcularMedia(total, quantidade) {
    if (quantidade === 0) return 0; //Previne divisão por zero
    return total / quantidade; 
}

function contarAcimaReferencia(categorias, referencia) {
    // filter() cria uma lista contendo apenas quem atende ao citerio .length pega o total
    return categorias.filter(cat => cat.emprestados > referencia).length;
}

function classificarMovimento(total) {
    if (total >= 150) {
        return "Alto";
    } else if (total >= 100 && total < 150) {
        return "Moderado";
    } else {
        return "Baixo";
    }
}

//3. FEEDBACK VISUAL AO USUÁRIO
function exibirMenssagem(texto, tipo) {
    const boxAlerta = document.getElementById("mensagem-alerta");
    if (!boxAlerta) return;

    boxAlerta.textContent = texto;// atualiza o texto da caixa de aviso
    boxAlerta.classList.remove("hidden", "bg-red-100", "text-red-700", "border-red-300", "bg-green-100", "text-green-700", "border-green-300"); //Remove classes anteriores para redefinir o estilo visual

    if (tipo === "erro") {
        boxAlerta.classList.add("bg-red-100", "text-red-700", "border", "border-red-300");
    } else {
        boxAlerta.classList.add("bg-green-100", "text-green-700", "border", "border-green-300");
    }

    setTimeout(() => {
        boxAlerta.classList.add("hidden");
    }, 4000);
}

// 4. MANIPULAÇÃO DO DOM
function atualizarTabela() {
    // Captura todas as linhas (tr) presentes no corpo da tabela (tbody)
    const linhasTabela = document.querySelectorAll("tbody tr");
    
    //Percorre cada categoria e atualiza a linha correnspondente pelo índice
    categoriasAcervo.forEach((categoria, index) => {
        const celulas = linhasTabela[index].querySelectorAll("td");
        const disponiveis = categoria.totalExemplares - categoria.emprestados;

        //Atualiza o conteúdo textual de cada coluna
        celulas[0].textContent = categoria.nome;
        celulas[1].textContent = categoria.totalExemplares;
        celulas[2].textContent = categoria.emprestados;
        celulas[3].textContent = disponiveis;
    });
}

function atualizarPainel() {
    //Executa as funções de cálculo 
    const total = calcularTotalEmprestimos(categoriasAcervo);
    const media = calcularMedia(total, categoriasAcervo.length);
    const acimaRef = contarAcimaReferencia(categoriasAcervo, valorReferencia);
    const classificacao = classificarMovimento(total);

    // Escreve os resultados diretamente nos elementos HTML pelo ID
    document.getElementById("total-emprestimos").textContent = `${total} empréstimos`;
    document.getElementById("media-emprestimos").textContent = `${media.toFixed(1)} por categoria`;
    document.getElementById("registros-acima").textContent = `${acimaRef} categorias (>${valorReferencia})`;
    
    const elementoClassificacao = document.getElementById("classificacao-movimento");
    if (elementoClassificacao) {
        elementoClassificacao.textContent = `${classificacao}`;
    }
}

// 5. LÓGICA DO FORMULÁRIO
// seleciona o formulário de adição no HTML
const formulario = document.getElementById("form-adicionar");


formulario.addEventListener("submit", function(evento) {
    evento.preventDefault(); //previne o comportamento padrão do navegador 

    //captura os elementos de entrada de dados
    const selectCategoria = document.getElementById("categoria-select");
    const selectAcao = document.getElementById("acao-select");
    const inputQuantidade = document.getElementById("quantidade-input");

    //converte e extrai os valores selecionados
    const indiceCategoria = Number(selectCategoria.value);
    const acao = selectAcao.value;      //"emprestar" ou "devolver"
    const quantidadeAdicional = Number(inputQuantidade.value);

    // Validação inicial: Verifica se o indice é u número válido e se a quantidade é positiva
    if (isNaN(indiceCategoria) || quantidadeAdicional <= 0) {
       exibirMenssagem("Por favor, preencha os campos corretamente.", "erro");
       return; // Interrompe o processamento se houver dados inválidos-
    }

    const categoria = categoriasAcervo[indiceCategoria];

    // ---OPERAÇÃO DE EMPRÉSTIMO-----
    if (acao === "emprestar") {
        const disponiveis = categoria.totalExemplares - categoria.emprestados;

        //VALIDAÇÃO DE LIMITE: Impede o empréstimo se exceder os livros em estoque
        if (quantidadeAdicional > disponiveis) {
            exibirMenssagem(`Erro: Não há exemplares suficientes de "${categoria.nome}". Disponíveis: ${disponiveis}`, "erro");
            return;
        }

        // se houver exemplares suficientes, incrementa a contagem de empréstimos
        categoria.emprestados += quantidadeAdicional;
        exibirMenssagem(`Sucesso! ${quantidadeAdicional} livro(s) de "${categoria.nome}" emprestado(s).`, "sucesso");

    //---OPERAÇÃO DE DEVOLUÇÃO---
    } else if (acao === "devolver") {
        //VALIDAÇÃO DE DEVOLUÇÃO: impede devolver mias livros do que o total atualmente emprestado
        if (quantidadeAdicional > categoria.emprestados) {
            exibirMenssagem(`Erro: Não é possível devolver ${quantidadeAdicional} livro(s). Emprestados atualmente: ${categoria.emprestados}`, "erro");
            return; //Aborta a operação
        }

        // Se a quantidade for válida, decrementa a contagem de empréstimos
        categoria.emprestados -= quantidadeAdicional;
        exibirMenssagem(`Sucesso! ${quantidadeAdicional} livro(s) de "${categoria.nome}" devolvido(s).`, "sucesso");
    }

    //Sincroniza as alterações com a interface do usuário
    atualizarTabela();
    atualizarPainel();
    //reseta todos os campos do fotmulário para o estado inicial
    formulario.reset();
});

// 5. Inicialização da página
atualizarTabela();
atualizarPainel();