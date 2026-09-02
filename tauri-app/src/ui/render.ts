import { gameState } from "../game/state";
import { contracts } from "../game/contracts";

type Child = string | Node;
type Attrs = Record<string, string>;
type TagBuilder = {
  [K in keyof HTMLElementTagNameMap]: (
    children?: Child | Child[],
    attrs?: Attrs
  ) => HTMLElementTagNameMap[K];
};

const t = new Proxy({} as TagBuilder, {
  get(target, property: string, receiver) {
    return (children: Child | Child[] = [], attrs: Attrs = {}) => {
      const el = document.createElement(property);
      for (let attr in attrs)
        el.setAttribute(attr, attrs[attr]);
      for (let child of(Array.isArray(children) ? children : [children])) {
        el.appendChild(typeof child === "string" ? document.createTextNode(child) : child);
      };
      return el;
    };
  }
});

/**
 * Mettre à jour les contrats côté frontend
 */
function renderContracts() {
  let contractsDiv = document.getElementById("contractsContainer");
  if (!contractsDiv) return;
  contractsDiv.innerHTML = ""

  contracts.forEach((contractObj, index) => {
  const isPreviousUnlocked = index === 0 || gameState.unlockedContracts.includes(contracts[index - 1].id);
  if (!isPreviousUnlocked) return;

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
          t.p([ `Récompense: ${contractObj.reward}€/click` ]),
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

/**
 * Mettre à jour l état du jeu côté frontend.
 */
export function render() {
  const balanceMsg = document.getElementById("balanceMsg");
  if (balanceMsg) balanceMsg.textContent = gameState.money.toString();

  const rep = document.getElementById("repMsg");
  if (rep) rep.textContent = gameState.reputation.toString();

  const contractMsg = document.getElementById("currentContractMsg");
  if (contractMsg) {
    const currentContract = contracts.find(c => c.id == gameState.currentContract)
    contractMsg.textContent = currentContract ? currentContract.title : "Aucun";
  }

  renderContracts();
}