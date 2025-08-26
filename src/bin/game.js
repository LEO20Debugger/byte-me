import readline from "readline";

function ask(question) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  return new Promise((resolve) =>
    rl.question(question, (ans) => {
      rl.close();
      resolve(ans);
    })
  );
}

export async function asciiAdventure10() {
  console.log(`
🗺️  Welcome to the 10-Level ASCII Adventure! 🗺️
You are an adventurer seeking the lost treasure of Eldoria.
Your choices will shape your journey. Some paths are dangerous, some rewarding. Good luck!
`);

  let hp = 10; // Player health
  let time = 0; // Time taken (arbitrary units)
  let inventory = [];

  // --- Level 1 ---
  let choice = await ask(`
Level 1: Forest Gate
1️⃣ Enter the dark forest
2️⃣ Walk along the river
Choose 1 or 2: `);

  if (choice === "1") {
    console.log("🌲 Dark forest! You trip on a root. Lose 1 HP.");
    hp -= 1;
    time += 2;
  } else {
    console.log("🏞️ River walk. Peaceful, you gain +1 time advantage.");
    time -= 1;
  }

  // --- Level 2 ---
  choice = await ask(`
Level 2: Crossroads
1️⃣ Take the mountain path ⛰️
2️⃣ Take the valley path 🌄
Choose 1 or 2: `);

  if (choice === "1") {
    console.log("⛰️ Mountain path is treacherous. Lose 2 HP.");
    hp -= 2;
    time += 3;
    if (hp <= 0)
      return console.log("💀 You fell and couldn't continue. Game Over.");
  } else {
    console.log("🌄 Valley is calm. You rest and recover 2 HP.");
    hp += 2;
    time += 2;
  }

  // --- Level 3 ---
  choice = await ask(`
Level 3: Strange Village
1️⃣ Enter the village 🏘️
2️⃣ Avoid it and go through the woods 🌳
Choose 1 or 2: `);

  if (choice === "1") {
    console.log("🏘️ Villagers welcome you. They give you a map 🗺️.");
    inventory.push("Map");
    time += 1;
  } else {
    console.log("🌳 Woods are thick. You waste time. +3 time units.");
    time += 3;
  }

  // --- Level 4 ---
  choice = await ask(`
Level 4: Mystic Bridge
1️⃣ Cross carefully 🌉
2️⃣ Jump over the river 🏃‍♂️
Choose 1 or 2: `);

  if (choice === "1") {
    console.log("🌉 You cross safely.");
    time += 1;
  } else {
    console.log("💦 You slip and fall! Lose 3 HP.");
    hp -= 3;
    time += 1;
    if (hp <= 0) return console.log("💀 You drowned in the river. Game Over.");
  }

  // --- Level 5 ---
  choice = await ask(`
Level 5: Cave Entrance
1️⃣ Enter the cave 🕳️
2️⃣ Go around it 🏞️
Choose 1 or 2: `);

  if (choice === "1") {
    console.log("🕳️ Cave is dark. You find a torch 🔥.");
    inventory.push("Torch");
    time += 1;
  } else {
    console.log("🏞️ Long path around cave. +4 time units.");
    time += 4;
  }

  // --- Level 6 ---
  choice = await ask(`
Level 6: Haunted Forest
1️⃣ Go through the forest 🌲
2️⃣ Take the secret path 🗝️
Choose 1 or 2: `);

  if (choice === "1") {
    console.log("👻 Ghost appears! You fight bravely but lose 2 HP.");
    hp -= 2;
    time += 2;
    if (hp <= 0)
      return console.log("💀 You were defeated by the ghost. Game Over.");
  } else {
    console.log("🗝️ Secret path avoids danger. +1 time advantage.");
    time -= 1;
  }

  // --- Level 7 ---
  choice = await ask(`
Level 7: Mountain Peak
1️⃣ Climb the peak 🧗‍♂️
2️⃣ Go through hidden cave 🕳️
Choose 1 or 2: `);

  if (choice === "1") {
    console.log("🧗‍♂️ Hard climb. Lose 1 HP but gain clear view (advantage).");
    hp -= 1;
    time -= 1;
  } else {
    console.log("🕳️ Hidden cave is safe but slow. +3 time units.");
    time += 3;
  }

  // --- Level 8 ---
  choice = await ask(`
Level 8: River Rapids
1️⃣ Use raft 🛶
2️⃣ Swim across 🏊
Choose 1 or 2: `);

  if (choice === "1") {
    console.log("🛶 Raft is safe. +1 time advantage.");
    time -= 1;
  } else {
    console.log("🏊 Strong current! Lose 2 HP.");
    hp -= 2;
    time += 2;
    if (hp <= 0) return console.log("💀 Swept away by rapids. Game Over.");
  }

  // --- Level 9 ---
  choice = await ask(`
Level 9: Ancient Temple
1️⃣ Enter through main gate 🏛️
2️⃣ Sneak in from side entrance 🚪
Choose 1 or 2: `);

  if (choice === "1") {
    console.log("🏛️ Main gate triggers trap! Lose 3 HP.");
    hp -= 3;
    time += 2;
    if (hp <= 0)
      return console.log("💀 You were crushed by a trap. Game Over.");
  } else {
    console.log("🚪 Side entrance is safe. You find treasure key 🗝️.");
    inventory.push("Temple Key");
    time += 1;
  }

  // --- Level 10 ---
  choice = await ask(`
Level 10: Treasure Chamber
1️⃣ Open the chest 🎁
2️⃣ Inspect room carefully 🔍
Choose 1 or 2: `);

  if (choice === "1") {
    if (inventory.includes("Temple Key")) {
      console.log(
        "🎉 You unlock the chest and find the legendary treasure! You WIN!"
      );
    } else {
      console.log("💥 Chest is trapped! You lose all HP. Game Over.");
      return;
    }
  } else {
    console.log(
      "🔍 You find a hidden switch that disarms traps and reveals treasure! You WIN!"
    );
  }

  console.log(
    `\n🏆 Adventure complete! HP left: ${hp}, Time taken: ${time}, Inventory: ${inventory.join(
      ", "
    )}`
  );
}

// --- Rock-Paper-Scissors ---
export function rpsGame() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  const choices = ["rock", "paper", "scissors"];

  console.log("🎮 Rock-Paper-Scissors! Type your choice:");

  rl.question("> ", (input) => {
    const user = input.toLowerCase();
    if (!choices.includes(user)) {
      console.log("❌ Invalid choice. Choose rock, paper, or scissors.");
      rl.close();
      return;
    }

    const cli = choices[Math.floor(Math.random() * 3)];
    console.log(`🤖 CLI chose: ${cli}`);

    if (user === cli) console.log("🤝 It's a tie!");
    else if (
      (user === "rock" && cli === "scissors") ||
      (user === "paper" && cli === "rock") ||
      (user === "scissors" && cli === "paper")
    )
      console.log("🎉 You win!");
    else console.log("💀 CLI wins!");

    rl.close();
  });
}
