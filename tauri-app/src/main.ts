import { gameState } from "./game/state";
import { contracts } from "./game/contracts";
import { render } from "./ui/render";

/**
 * Fonction pour ajouter de l argent au solde actuel.
 * Si un contract est en cours, on ajoute au solde sa
 * récompense définie.
 */
function addMoney() {
  const activeContract = contracts.find(c => c.id === gameState.currentContract);
  const reward = activeContract ? activeContract.reward : 1;
  gameState.money += reward;
}

/**
 * Début du backend. Ecouter les boutons pour gagner de l argent
 * et pour débloquer un contrat.
 */
window.addEventListener("DOMContentLoaded", () => {
  render();

  document.getElementById("clickBtn")?.addEventListener("click", (e) => {
    addMoney();
    render();
  });

  document.getElementById("contractsContainer")?.addEventListener("click", (e) => {
    const target = e.target as HTMLElement;
    if (target.tagName == "BUTTON") {
      const contractId = target.getAttribute("data-id");
      const contract = contracts.find(c => c.id === contractId);

      if (!contractId || !contract) return;

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
