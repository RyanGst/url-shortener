#!/usr/bin/env -S deno run --allow-read=deno.json --allow-write=deno.json --allow-run=git

async function runCommand(cmd: string, args: string[]) {
  console.log(`Running: ${cmd} ${args.join(" ")}`);
  const command = new Deno.Command(cmd, {
    args: args,
    stdout: "piped",
    stderr: "piped",
  });
  const { code, stdout, stderr } = await command.output();

  if (code !== 0) {
    console.error(`Error running ${cmd}:`);
    console.error(new TextDecoder().decode(stderr));
    Deno.exit(code);
  }
  console.log(new TextDecoder().decode(stdout));
}

const bumpType = Deno.args[0];
if (!["patch", "minor", "major"].includes(bumpType)) {
  console.error("Usage: deno run deploy.ts <patch|minor|major>");
  Deno.exit(1);
}

const configPath = "deno.json";
const config = JSON.parse(await Deno.readTextFile(configPath));
const currentVersion = config.version;

let [major, minor, patch] = currentVersion.split(".").map(Number);

switch (bumpType) {
  case "patch": patch++; break;
  case "minor": minor++; patch = 0; break;
  case "major": major++; minor = 0; patch = 0; break;
}

const newVersion = `${major}.${minor}.${patch}`;
config.version = newVersion;

// Write the updated deno.json
await Deno.writeTextFile(configPath, JSON.stringify(config, null, 2) + "\n");
console.log(`Version bumped from ${currentVersion} to ${newVersion} in ${configPath}`);

// Git commands
const tagName = `v${newVersion}`;
const commitMessage = `New version: ${tagName}`;

await runCommand("git", ["add", configPath]);
await runCommand("git", ["commit", "-m", commitMessage]);
await runCommand("git", ["tag", tagName]);

console.log(`Created commit and tag ${tagName}.`);
console.log("Run 'git push --follow-tags' to push changes.");
