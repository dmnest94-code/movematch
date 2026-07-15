window.MoveMatchEngine = {
  recommend(data) {
    const { priority, moveType, packing, specialItems, additionalHelp, access } = data;

    let style = "Protected Move";
    let crew = "3 movers";
    let consultation = "Video estimate";
    let reason = "Your move benefits from a balanced plan with extra protection and a professional review.";

    if (priority === "Essential") {
      style = "Essential Move";
      reason = "Keeping costs low is your top priority, so we recommend a streamlined move with only the protection and labor you need.";
    }

    if (priority === "Concierge" || packing === "Full packing") {
      style = "Concierge Move";
      reason = "You want a hands-off experience, so we recommend full-service support from packing through setup.";
    } else if (
      priority === "Protected" ||
      specialItems.length >= 2 ||
      specialItems.some(item => ["Artwork", "Antiques", "Piano", "Safe"].includes(item))
    ) {
      style = "Protected Move";
      reason = "Furniture protection and careful handling are important for this move, especially with the special items you selected.";
    }

    if (moveType === "Studio") crew = "2 movers";
    if (moveType === "1 Bedroom Apartment") crew = "2–3 movers";
    if (moveType === "2 Bedroom Apartment") crew = "3 movers";
    if (moveType === "3+ Bedroom / House") crew = "4 movers";
    if (moveType === "Office / Commercial Space") {
      crew = "Commercial crew review";
      reason = "Commercial moves require a crew and schedule matched to the workspace, access restrictions and business equipment.";
    }

    const complexItem = specialItems.some(item => ["Antiques", "Piano", "Safe"].includes(item));
    const heavyItem = additionalHelp.includes("Heavy Item (250+ lbs)");
    const complexAccess = ["Multiple flights", "Elevator / building restrictions"].includes(access);

    if (
      moveType === "3+ Bedroom / House" ||
      moveType === "Office / Commercial Space" ||
      complexItem ||
      heavyItem
    ) {
      consultation = "Complimentary in-home consultation";
    } else if (
      complexAccess ||
      specialItems.length > 0 ||
      additionalHelp.length > 0 ||
      packing !== "None"
    ) {
      consultation = "Video estimate";
    } else {
      consultation = "Quick phone estimate";
    }

    return { style, crew, consultation, reason };
  }
};
