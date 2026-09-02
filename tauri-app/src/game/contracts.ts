type Contract = {
  id: string;
  title: string;
  reward: number;
  cost: number;
};

export const contracts: Contract[] = [
    { id: 'freelance_web', title: 'Freelance Web Developer', reward: 5, cost: 100 },
    { id: 'corporate_consultant', title: 'Consultant en entreprise', reward: 25, cost: 500 },
    { id: 'startup_founder', title: 'Fondateur de start-up', reward: 100, cost: 2500 },
]