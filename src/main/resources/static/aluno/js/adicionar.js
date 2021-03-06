$(document).ready(function () {

	document.getElementById('cadastro').style.display = 'none';

	let email = sessionStorage.getItem("sess_email_aluno");
	let tela = document.querySelector('#tabela-projetos');
	let telaemail = document.getElementById('bodyemail');
	let rota = "/projetos"
	let rota_medalhas = "/medalhas"
	let retorno = {}

	$.get(rota, function (projetosBE, err) {
		
		let projects = JSON.parse(projetosBE);
		let wichParticipate = [];
		for (i = 0; i < projects.length; i++) {
			isParticipate = projects[i].alunos.find(aluno => aluno == email)
			//alert(projects[i].alunos.email);
			if (isParticipate) {
				wichParticipate.push(i);
			}
		}
		if (wichParticipate) {
			wichParticipate.map((index) => {
				console.log(index);
				var $tela = document.querySelector('#tpjr'),
					HTMLTemporario = $tela.innerHTML,
					HTMLNovo = "<tr> <th>" + projects[index].chave + "</th>"
						+ "<th>" + projects[index].titulo + "</th>" + "<th>"
						+ projects[index].fase + "</th>"
						+ `<th><button onclick="abrePopupEntregar(event,chave='${projects[index].chave}')">Entregar</button></th>`
						+ "</tr>";
				HTMLTemporario = HTMLTemporario + HTMLNovo;
				$tela.innerHTML = HTMLTemporario;
			});
		}
	});
	
	$.get(rota_medalhas, function (medalBE, err) {	

		let medal = JSON.parse(medalBE);
		let wichParticipate = [];
		for (i = 0; i < medal.length; i++) {
			if (medal[i].email_aluno==email) {
				wichParticipate.push(i);
			}
		}
		if (wichParticipate) {
			wichParticipate.map((index) => {
				console.log(index);
				var $tela = document.querySelector('#tpjr2'),
					HTMLTemporario = $tela.innerHTML,
					HTMLNovo = "<tr> <th>" + medal[index].nameMedal + "</th>"
						+ "<th>" + medal[index].nivel + "</th>" + "<th>"
						+ medal[index].email_professor + "</th>"
						+ "</tr>";
				HTMLTemporario = HTMLTemporario + HTMLNovo;
				$tela.innerHTML = HTMLTemporario;
			});
		}
	});

	$('#botao-add').click(function () {
		let codigoProjeto = $("#codigo-projetoLabel").val();
		let email = sessionStorage.getItem("sess_email_aluno");

		const retornaBack = val => {
			if (val=='[]') {
				document.getElementById("erro-add").style.display = "block";
				return false;
			}
			else {
				let email = sessionStorage.getItem("sess_email_aluno");
				let nowBackEndData = JSON.parse(val);
				let alreadyParticipate = false;
				alreadyParticipate = nowBackEndData[0].alunos.find(aluno => aluno == email);
				if (!alreadyParticipate) {
					nowBackEndData[0].alunos.push(email);

					$.post("/add-projeto", JSON.stringify(nowBackEndData[0]), function (data) {
						if (data != "false") {
							document.getElementById("erro-add-already").style.display = "none";
							document.getElementById("erro-add").style.display = "none";
							window.location.href = 'principal.html';
						}
						else document.getElementById("erro-add").style.display = "block";
					});

				}
				else {
					document.getElementById("erro-add-already").style.display = "block";
				}
			}
		}

		$.get("/searchaluno/" + codigoProjeto, retornaBack);

	});

	function abrePopupLogin(event) {
		event.preventDefault();
		document.getElementById('login').style.display = 'block';
	}

	function fechaPopupLogin(event) {
		event.preventDefault();
		document.getElementById('login').style.display = 'none';
	}

});	