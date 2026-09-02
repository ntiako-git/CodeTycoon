const gameState = {
  money: 0,
  reputation: 0,
  currentContract: null,
  unlockedContracts: []
}

const contracts = [
    { id: 'freelance_web', title: 'Freelance Web Developer', rewards: 5, cost: 100 },
    { id: 'corporate_consultant', title: 'Consultant en entreprise', rewards: 25, cost: 500 },
    { id: 'startup_founder', title: 'Fondateur de start-up', rewards: 100, cost: 2500 },
]

function addMoney() {
  const activeContract = contracts.find(c => c.id === gameState.currentContract);
  const reward = activeContract ? activeContract.rewards : 1;
  gameState.money += reward;
}

const t = new Proxy({}, {
  get(target, property, receiver) {
    return (children, attrs) => {
      const el = document.createElement(property);
      for (let attr in attrs) {
        el.setAttribute(attr, attrs[attr]);
      };
      for (let child of(Array.isArray(children) ? children : [children])) {
        el.appendChild(typeof child === "string" ? document.createTextNode(child) : child);
      };
      return el;
    };
  }
});

function render() {
  document.getElementById("balanceMsg").textContent = gameState.money;
  document.getElementById("repMsg").textContent = gameState.reputation;
  const currentContract = contracts.find(c => c.id == gameState.currentContract)
  document.getElementById("currentContractMsg").textContent = currentContract ? currentContract.title : "Aucun";

  renderContracts();
}

function renderContracts() {
  let contractsDiv = document.getElementById("contractsContainer");
  contractsDiv.innerHTML = "";

  contracts.forEach((contractObj, index) => {
  const isPreviousUnlocked = index === 0 || gameState.unlockedContracts.includes(contracts[index - 1].id);
  if (!isPreviousUnlocked) {
    return;
  }

  const isUnlocked = gameState.unlockedContracts.includes(contractObj.id);
  const isActive = gameState.currentContract === contractObj.id;

  let buttonText = "Débloquer";
  let isDisabled = false;

  if (isActive) {
    buttonText = "Actif";
    isDisabled = true;
  } else if (isUnlocked) {
    buttonText = "Sélectionner";
  }

  let contractDiv = t.div([
    t.h3([ contractObj.title ]),
      t.div([
        t.div([
          t.p([ `Récompense: ${contractObj.rewards}€/click` ]),
          t.p([ `Prix: ${contractObj.cost}€` ])
        ]),
        t.button([ buttonText ], {
          "data-id": contractObj.id,
          ...(isDisabled ? { disabled: "true" } : {})
        })
      ], { id: "contractContent" })
    ], { id: "contractCard" } );

    contractsDiv.appendChild(contractDiv);
  });
}

window.addEventListener("DOMContentLoaded", () => {
  render();

  document.getElementById("clickBtn")?.addEventListener("click", (e) => {
    e.preventDefault();
    addMoney();
    render();
  });

  document.getElementById("contractsContainer")?.addEventListener("click", (e) => {
    if (e.target.tagName == "BUTTON") {
      const contractId = e.target.getAttribute("data-id");
      const contract = contracts.find(c => c.id === contractId);

      if (!contract) return;

      const isUnlocked = gameState.unlockedContracts.includes(contractId);
      if (isUnlocked) {
        gameState.currentContract = contractId;
        render();
      } else {
        if (gameState.money >= contract.cost) {
            gameState.money -= contract.cost;
            gameState.unlockedContracts.push(contractId);
            gameState.currentContract = contractId;
            render();
        } else {
            alert("Pas assez d'argent !");
        }
      }
    }
  })
});
