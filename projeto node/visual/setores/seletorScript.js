 const API_URL = "http://localhost:3000/api/setores"; 
    const TOKEN = "seuTokenDeGerenteAqui"; // simulação de autenticação

    const form = document.getElementById("setorForm");
    const listaSetores = document.getElementById("listaSetores");
    const mensagem = document.getElementById("mensagem");

    // 🔹 Carregar setores na tela
    async function carregarSetores() {
      listaSetores.innerHTML = "";
      try {
        const res = await fetch(API_URL, {
          headers: { "Authorization": `Bearer ${TOKEN}` }
        });
        const setores = await res.json();

        setores.forEach(setor => {
          adicionarSetorNaLista(setor);
        });
      } catch (err) {
        mensagem.textContent = "⚠️ Erro ao carregar setores.";
        mensagem.className = "text-red-600 font-semibold";
      }
    }

    // 🔹 Função para adicionar setor no HTML
    function adicionarSetorNaLista(setor) {
      const li = document.createElement("li");
      li.className = "bg-white p-4 rounded shadow flex justify-between items-center";
      li.innerHTML = `
        <div>
          <p class="font-semibold text-gray-800">${setor.nome}</p>
          <p class="text-sm text-gray-600">Responsável: ${setor.responsavel}</p>
        </div>
        <button class="text-red-600 hover:underline">Remover</button>
      `;
      
      // Evento de remover setor
      li.querySelector("button").addEventListener("click", async () => {
        try {
          const res = await fetch(`${API_URL}/remove/${setor.id}`, {
            method: "DELETE",
            headers: { "Authorization": `Bearer ${TOKEN}` }
          });

          if (res.ok) {
            li.remove();
          } else {
            alert("Erro ao remover setor.");
          }
        } catch {
          alert("Erro de conexão ao tentar remover setor.");
        }
      });

      listaSetores.appendChild(li);
    }

    // 🔹 Cadastro de novo setor
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const nome = document.getElementById("nome").value;
      const responsavel = document.getElementById("responsavel").value;

      try {
        const res = await fetch(`${API_URL}/add`, {
          method: "POST",
          headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${TOKEN}`
          },
          body: JSON.stringify({ nome, responsavel })
        });

        const data = await res.json();

        if (res.ok) {
          mensagem.textContent = "✅ Setor cadastrado com sucesso!";
          mensagem.className = "mt-3 text-center text-green-600 font-semibold";
          adicionarSetorNaLista(data.setor);
          form.reset();
        } else {
          mensagem.textContent = "❌ " + data.message;
          mensagem.className = "mt-3 text-center text-red-600 font-semibold";
        }
      } catch (error) {
        mensagem.textContent = "⚠️ Erro de conexão com o servidor.";
        mensagem.className = "mt-3 text-center text-yellow-600 font-semibold";
      }
    });

    // 🔹 Carregar lista assim que abrir a página
    carregarSetores();