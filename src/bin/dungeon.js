// src/bin/dungeon.js
// Lightweight ASCII Rogue-like for the terminal (ESM).
// Movement: W/A/S/D or Arrow Keys. Quit: Q.
// Exports: runDungeon()

import readline from "readline";

// ======= Config =======
const WIDTH = 25;
const HEIGHT = 12;
const WALL_DENSITY = 0.12; // 12% walls
const MONSTERS = 6;
const LOOT = 5;

// Tokens (switch to ascii if you prefer)
const TOKENS = {
  wall: "#",
  floor: " ",
  player: { knight: "🛡️", wizard: "🧙", rogue: "🗡️" },
  monster: "👾",
  chest: "💎",
  sword: "⚔️",
  exit: "⛩️",
  heart: "❤",
};

const CLASSES = {
  knight: {
    hp: 30,
    atk: 7,
    def: 3,
    crit: 0.05,
    icon: TOKENS.player.knight,
    skill: "Shield Bash",
  },
  wizard: {
    hp: 24,
    atk: 9,
    def: 1,
    crit: 0.07,
    icon: TOKENS.player.wizard,
    skill: "Fireball",
  },
  rogue: {
    hp: 26,
    atk: 6,
    def: 2,
    crit: 0.18,
    icon: TOKENS.player.rogue,
    skill: "Backstab",
  },
};

const MONSTER_TYPES = [
  { name: "Goblin", hp: 12, atk: 4, def: 1, reward: 8 },
  { name: "Skeleton", hp: 14, atk: 5, def: 1, reward: 10 },
  { name: "Slime", hp: 10, atk: 3, def: 0, reward: 6 },
  { name: "Orc", hp: 18, atk: 6, def: 2, reward: 14 },
  { name: "Warlock", hp: 16, atk: 7, def: 1, reward: 16 },
];

const ITEMS = [
  {
    type: "potion",
    label: "Potion",
    effect: (p) => {
      p.hp = Math.min(p.maxHp, p.hp + 12);
      return "+12 HP";
    },
  },
  {
    type: "sword",
    label: "Sword",
    effect: (p) => {
      p.atk += 2;
      return "+2 ATK";
    },
    icon: TOKENS.sword,
  },
  {
    type: "gem",
    label: "Gem",
    effect: (p) => {
      p.gold += 10;
      return "+10 gold";
    },
    icon: TOKENS.chest,
  },
];

// ======= Helpers =======
const randInt = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
const choice = (arr) => arr[randInt(0, arr.length - 1)];
const clamp = (v, min, max) => Math.max(min, Math.min(max, v));
const clear = () => process.stdout.write("\x1b[2J\x1b[0f"); // clear screen
const color = {
  dim: (s) => `\x1b[2m${s}\x1b[0m`,
  green: (s) => `\x1b[32m${s}\x1b[0m`,
  red: (s) => `\x1b[31m${s}\x1b[0m`,
  yellow: (s) => `\x1b[33m${s}\x1b[0m`,
  cyan: (s) => `\x1b[36m${s}\x1b[0m`,
  bold: (s) => `\x1b[1m${s}\x1b[0m`,
};

// ======= Map Generation =======
function makeEmptyMap(w, h, fill = TOKENS.floor) {
  return Array.from({ length: h }, () => Array.from({ length: w }, () => fill));
}

function carveWalls(map) {
  for (let y = 0; y < HEIGHT; y++) {
    for (let x = 0; x < WIDTH; x++) {
      if (y === 0 || y === HEIGHT - 1 || x === 0 || x === WIDTH - 1) {
        map[y][x] = TOKENS.wall;
        continue;
      }
      if (Math.random() < WALL_DENSITY) map[y][x] = TOKENS.wall;
    }
  }
}

function findFreeCell(map) {
  let x, y;
  do {
    x = randInt(1, WIDTH - 2);
    y = randInt(1, HEIGHT - 2);
  } while (map[y][x] !== TOKENS.floor);
  return { x, y };
}

function placeStuff(map, char, count) {
  const placed = [];
  for (let i = 0; i < count; i++) {
    const { x, y } = findFreeCell(map);
    map[y][x] = char;
    placed.push({ x, y });
  }
  return placed;
}

// ======= Game State =======
function createGameState(playerClass) {
  const base = CLASSES[playerClass];
  const map = makeEmptyMap(WIDTH, HEIGHT);
  carveWalls(map);

  // Guarantee a starting area
  const start = { x: 2, y: 2 };
  map[start.y][start.x] = TOKENS.floor;
  map[start.y][start.x + 1] = TOKENS.floor;
  map[start.y + 1][start.x] = TOKENS.floor;

  // Place exit
  const exit = findFreeCell(map);
  map[exit.y][exit.x] = TOKENS.exit;

  // Place monsters and loot
  const monsters = placeStuff(map, TOKENS.monster, MONSTERS);
  const loot = placeStuff(map, TOKENS.chest, LOOT);

  const player = {
    class: playerClass,
    icon: base.icon,
    x: start.x,
    y: start.y,
    hp: base.hp,
    maxHp: base.hp,
    atk: base.atk,
    def: base.def,
    crit: base.crit,
    skill: base.skill,
    potions: 1,
    gold: 0,
    xp: 0,
    level: 1,
  };

  return { map, player, monsters, loot, exit, log: [] };
}

// ======= Rendering =======
function draw(state) {
  const { map, player } = state;
  clear();
  // draw map with player
  let out = "";
  for (let y = 0; y < HEIGHT; y++) {
    for (let x = 0; x < WIDTH; x++) {
      if (x === player.x && y === player.y) out += player.icon;
      else out += map[y][x];
    }
    out += "\n";
  }
  console.log(out);

  // HUD
  const hpBar = color.red(`${TOKENS.heart} ${player.hp}/${player.maxHp}`);
  const stats = `${color.bold(player.class.toUpperCase())}  ATK:${
    player.atk
  } DEF:${player.def} CRIT:${Math.round(player.crit * 100)}%  🧪:${
    player.potions
  }  🪙:${player.gold}  ⭐:${player.level}`;
  console.log(`${hpBar}   ${stats}`);

  if (state.log.length) {
    console.log(color.dim("──────────────────────────────────────────────"));
    state.log.slice(-5).forEach((line) => console.log(line));
  }
  console.log(
    color.dim(
      "\nMove with W/A/S/D or Arrow Keys · [E]=Use Skill · [P]=Potion · [Q]=Quit"
    )
  );
}

// ======= Combat =======
function makeMonster() {
  const m = JSON.parse(JSON.stringify(choice(MONSTER_TYPES)));
  // small random variation
  m.hp += randInt(-2, 2);
  m.atk += randInt(0, 1);
  m.def += randInt(0, 1);
  return m;
}

function attackRoll(atk, def) {
  const base = Math.max(1, atk - def);
  const variance = randInt(-1, 2);
  return Math.max(1, base + variance);
}

function combat(state) {
  const m = makeMonster();
  const p = state.player;
  state.log.push(color.yellow(`⚔️  A ${m.name} appears! (HP ${m.hp})`));

  // Simple sync-ish loop using prompt cycle
  state.inCombat = { monster: m, turn: "player" };
}

function combatStep(state, input) {
  const p = state.player;
  const c = state.inCombat;
  const m = c.monster;

  function playerAttack(mult = 1, critBonus = 0) {
    let dmg = Math.floor(attackRoll(p.atk * mult, m.def));
    const isCrit = Math.random() < p.crit + critBonus;
    if (isCrit) dmg = Math.floor(dmg * 1.7);
    m.hp -= dmg;
    state.log.push(
      color.green(
        `You hit the ${m.name} for ${dmg}${isCrit ? " (CRIT)" : " "} dmg.`
      )
    );
  }

  function monsterAttack() {
    let dmg = Math.floor(attackRoll(m.atk, p.def));
    p.hp -= dmg;
    state.log.push(color.red(`The ${m.name} hits you for ${dmg} dmg.`));
  }

  // Player turn
  if (c.turn === "player") {
    if (input === "attack") {
      playerAttack();
      c.turn = "monster";
    } else if (input === "skill") {
      // simple class-based skill
      if (p.class === "wizard") {
        state.log.push(color.yellow("You cast 🔥 Fireball!"));
        playerAttack(1.4, 0.05);
      } else if (p.class === "knight") {
        state.log.push(
          color.yellow("You perform 🛡️ Shield Bash! (reduce enemy attack)")
        );
        playerAttack(1.1, 0);
        m.atk = Math.max(1, m.atk - 1);
      } else if (p.class === "rogue") {
        state.log.push(color.yellow("You attempt 🗡️ Backstab!"));
        playerAttack(1.0, 0.25);
      }
      c.turn = "monster";
    } else if (input === "potion") {
      if (p.potions > 0) {
        p.potions--;
        const healed = 12;
        p.hp = Math.min(p.maxHp, p.hp + healed);
        state.log.push(
          color.green(`You drink a potion and recover +${healed} HP.`)
        );
        c.turn = "monster";
      } else {
        state.log.push(color.red("No potions left!"));
      }
    } else if (input === "run") {
      if (Math.random() < 0.5) {
        state.log.push(color.yellow("You successfully ran away."));
        state.inCombat = null;
        return;
      } else {
        state.log.push(color.red("Couldn't escape!"));
        c.turn = "monster";
      }
    }
  }

  // Monster dead?
  if (m.hp <= 0) {
    const reward = randInt(8, 16);
    p.gold += reward;
    p.xp += 10;
    state.log.push(
      color.green(`You slay the ${m.name}! +${reward} gold, +10 XP.`)
    );
    levelCheck(state);
    state.inCombat = null;
    return;
  }

  // Monster turn
  if (c.turn === "monster") {
    monsterAttack();
    if (p.hp <= 0) return; // death handled by main loop
    c.turn = "player";
  }
}

function levelCheck(state) {
  const p = state.player;
  const threshold = p.level * 20;
  if (p.xp >= threshold) {
    p.level++;
    p.xp -= threshold;
    p.maxHp += 3;
    p.hp = p.maxHp;
    p.atk += 1;
    if (p.level % 2 === 0) p.def += 1;
    state.log.push(
      color.cyan(`✨ You leveled up! Now Level ${p.level}. Stats increased.`)
    );
  }
}

// ======= Loot =======
function openChest(state) {
  const p = state.player;
  const item = choice(ITEMS);
  const msg = item.effect(p);
  state.log.push(color.yellow(`You found ${item.label}! ${msg}`));
}

// ======= Movement & Interactions =======
function tryMove(state, dx, dy) {
  if (state.inCombat) return; // can't move in combat
  const { map, player } = state;
  const nx = clamp(player.x + dx, 1, WIDTH - 2);
  const ny = clamp(player.y + dy, 1, HEIGHT - 2);

  if (map[ny][nx] === TOKENS.wall) {
    state.log.push(color.dim("You bump into a wall."));
    return;
  }

  player.x = nx;
  player.y = ny;

  const tile = map[ny][nx];
  if (tile === TOKENS.monster) {
    combat(state);
    // remove token so it won't re-trigger
    map[ny][nx] = TOKENS.floor;
  } else if (tile === TOKENS.chest) {
    openChest(state);
    map[ny][nx] = TOKENS.floor;
  } else if (tile === TOKENS.exit) {
    state.won = true;
  } else {
    // random encounter chance while walking
    if (Math.random() < 0.06) combat(state);
  }
}

// ======= Input Handling =======
function enableKeys(onKey) {
  readline.emitKeypressEvents(process.stdin);
  if (process.stdin.isTTY) process.stdin.setRawMode(true);
  const handler = (str, key) => onKey(str, key);
  process.stdin.on("keypress", handler);
  return () => process.stdin.off("keypress", handler);
}

// ======= Class Selection Prompt =======
async function chooseClass() {
  clear();
  console.log(color.bold("Choose your class:\n"));
  console.log(
    "  [1] 🛡️  Knight   — High DEF, steady damage, skill: Shield Bash"
  );
  console.log("  [2] 🧙  Wizard   — High ATK, low DEF, skill: Fireball");
  console.log("  [3] 🗡️  Rogue    — High CRIT, evasive, skill: Backstab\n");
  process.stdout.write(color.dim("Press 1 / 2 / 3 ... "));

  return new Promise((resolve) => {
    const stop = enableKeys((_s, key) => {
      if (key && (key.name === "1" || key.name === "2" || key.name === "3")) {
        stop();
        const map = { 1: "knight", 2: "wizard", 3: "rogue" };
        resolve(map[key.name]);
      }
    });
  });
}

// ======= Game Loop =======
export async function runDungeon() {
  const cls = await chooseClass();
  const state = createGameState(cls);

  const stop = enableKeys((_s, key) => {
    if (!key) return;
    const name = key.name;

    if (name === "q" || (key.ctrl && name === "c")) {
      stop();
      clear();
      console.log(color.bold("Thanks for playing!"));
      process.exit(0);
    }

    if (state.player.hp <= 0 || state.won) return; // freeze after end

    // Movement
    if (["up", "w"].includes(name)) tryMove(state, 0, -1);
    if (["down", "s"].includes(name)) tryMove(state, 0, 1);
    if (["left", "a"].includes(name)) tryMove(state, -1, 0);
    if (["right", "d"].includes(name)) tryMove(state, 1, 0);

    // Combat inputs
    if (state.inCombat) {
      if (name === "e") combatStep(state, "skill");
      else if (name === "p") combatStep(state, "potion");
      else if (name === "space" || name === "return")
        combatStep(state, "attack");
      else if (name === "r") combatStep(state, "run");
    }

    draw(state);

    // Check death/win
    if (state.player.hp <= 0) {
      state.log.push(color.red("💀 You have fallen..."));
      draw(state);
      setTimeout(() => {
        stop();
        process.exit(0);
      }, 1200);
    } else if (state.won) {
      state.log.push(
        color.green("🎉 You found the exit and escaped the dungeon!")
      );
      draw(state);
      setTimeout(() => {
        stop();
        process.exit(0);
      }, 1400);
    }
  });

  // Initial draw
  draw(state);
}

// For manual testing: uncomment below to run directly
// if (import.meta.url === `file://${process.argv[1]}`) runDungeon();
