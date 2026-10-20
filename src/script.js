// 1. Variáveis de estado global
let registrosEmprestimos = [35, 20, 30, 15, 28, 22]; // Usando let para permitir modificações, se necessário
const mesAnalise = "Setembro de 2026";
const valorReferencia = 25;

// 2. Funções de Cálculo
function calcularTotal(valores) {
    let soma = 0;
    for (let valor of valores) { 
        soma += valor; 
    }
    return soma;
}

function calcularMedia(total, quantidade) {
    if (quantidade === 0) return 0;
    return total / quantidade; 
}

function contarAcimaReferencia(valores, referencia) {
    let contador = 0;
    for (let i = 0; i < valores.length; i++) { 
        if (valores[i] > referencia) { 
            contador++;
        }
    }
    return contador;
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

// 3. Funções de Atualização da Interface (DOM)

// Atualiza a tabela HTML com base nos dados do array
function atualizarTabela() {
    const linhasTabela = document.querySelectorAll("tbody tr");
    for (let i = 0; i < linhasTabela.length; i++) {
        const celulaQuantidade = linhasTabela[i].querySelectorAll("td")[1];
        celulaQuantidade.textContent = registrosEmprestimos[i];
    }
}

// Recalcula tudo e atualiza os cards de resultados
function atualizarPainel() {
    const totalEmprestimos = calcularTotal(registrosEmprestimos);
    const mediaEmprestimos = calcularMedia(totalEmprestimos, registrosEmprestimos.length);
    const quantidadeAcimaRef = contarAcimaReferencia(registrosEmprestimos, valorReferencia);
    const classificacao = classificarMovimento(totalEmprestimos);

    document.getElementById("total-emprestimos").textContent = `${totalEmprestimos} empréstimos`;
    document.getElementById("media-emprestimos").textContent = `${mediaEmprestimos.toFixed(1)} por categoria`;
    document.getElementById("registros-acima").textContent = `${quantidadeAcimaRef} categorias (>${valorReferencia})`;
    
    const elementoClassificacao = document.getElementById("classificacao-movimento");
    if (elementoClassificacao) {
        elementoClassificacao.textContent = `${classificacao}`;
    }
}

// 4. Lógica de Adição de Novos Valores (Formulário)
const formulario = document.getElementById("form-adicionar");

formulario.addEventListener("submit", function(evento) {
    // Evita que a página recarregue ao clicar no botão
    evento.preventDefault();

    // Captura os valores inseridos pelo usuário
    const selectCategoria = document.getElementById("categoria-select");
    const inputQuantidade = document.getElementById("quantidade-input");

    // Converte os valores para números
    const indiceCategoria = Number(selectCategoria.value); // Pega o índice (0 a 5)
    const quantidadeAdicional = Number(inputQuantidade.value);

    // Valida se os dados estão corretos e atualiza
    if (!isNaN(indiceCategoria) && quantidadeAdicional > 0) {
        // Soma a nova quantidade ao valor já existente na categoria selecionada
        registrosEmprestimos[indiceCategoria] += quantidadeAdicional;

        // Atualiza a interface visualmente
        atualizarTabela();
        atualizarPainel();

        // Limpa os campos do formulário para a próxima inserção
        formulario.reset();
        
        // Log para auditoria
        console.log(`Adicionado +${quantidadeAdicional} à categoria índice ${indiceCategoria}. Novo array: [${registrosEmprestimos}]`);
    }
});

// 5. Inicialização da página (Carrega os dados iniciais na primeira vez)
atualizarTabela();
atualizarPainel();