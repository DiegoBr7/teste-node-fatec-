  function login() {
      const email = document.getElementById("email").value;
      const senha = document.getElementById("senha").value;
      const errorMessage = document.getElementById("error");

      // Exemplo de validação simples
      if (email === "usuario@teste.com" && senha === "1234") {
        alert("Login realizado com sucesso! Redirecionando...");
        window.location.href = "pagina_inicial.html"; // simula redirecionamento
      } else {
        errorMessage.style.display = "block";
      }
    }

    function limparCampos() {
      document.getElementById("email").value = "";
      document.getElementById("senha").value = "";
      document.getElementById("error").style.display = "none";
    }