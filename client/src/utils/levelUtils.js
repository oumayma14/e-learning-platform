export const getLevelFromScore = (score) => {
    if (score >= 600) {
      return { level: "Maître 🚀", color: "#9B30FF" };
    }
    if (score >= 500) {
      return { level: "Expert 🥇", color: "#FFD700" };
    }
    if (score >= 200) {
      return { level: "Avancé 🧠", color: "#1E90FF" };
    }
    if (score >= 100) {
      return { level: "Intermédiaire 🏃", color: "#00C49F" };
    }
    return { level: "Débutant 👶", color: "#808080" };
  };
  