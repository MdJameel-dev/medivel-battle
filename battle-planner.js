const advantageMap = {
    'Militia': ['Spearmen', 'LightCavalry'],
    'Spearmen': ['LightCavalry', 'HeavyCavalry'],
    'LightCavalry': ['FootArcher', 'CavalryArcher'],
    'HeavyCavalry': ['Militia', 'FootArcher', 'LightCavalry'],
    'CavalryArcher': ['Spearmen', 'HeavyCavalry'],
    'FootArcher': ['Militia', 'CavalryArcher'],
};

function parsePlatoons(input) {
    return input.split(';').map(entry => {
        const [type, count] = entry.split('#');
        return { type, count: parseInt(count) };
    });
}

function hasAdvantage(attackerType, defenderType) {
    return advantageMap[attackerType]?.includes(defenderType);
}

function battleOutcome(our, enemy) {
    const effectiveOurCount = hasAdvantage(our.type, enemy.type) ? our.count * 2 : our.count;
    const effectiveEnemyCount = hasAdvantage(enemy.type, our.type) ? enemy.count * 2 : enemy.count;

    if (effectiveOurCount > effectiveEnemyCount) return 'win';
    if (effectiveOurCount < effectiveEnemyCount) return 'lose';
    return 'draw';
}

function* permute(arr, l = 0) {
    if (l === arr.length - 1) {
        yield arr.slice();
    } else {
        for (let i = l; i < arr.length; i++) {
            [arr[l], arr[i]] = [arr[i], arr[l]];
            yield* permute(arr, l + 1);
            [arr[l], arr[i]] = [arr[i], arr[l]]; // backtrack
        }
    }
}

function findWinningArrangement(ourInput, enemyInput) {
    const ourPlatoons = parsePlatoons(ourInput);
    const enemyPlatoons = parsePlatoons(enemyInput);

    for (let permutation of permute(ourPlatoons)) {
        let winCount = 0;

        for (let i = 0; i < 5; i++) {
            const result = battleOutcome(permutation[i], enemyPlatoons[i]);
            if (result === 'win') winCount++;
        }

        if (winCount >= 3) {
            return permutation.map(p => `${p.type}#${p.count}`).join(';');
        }
    }

    return "There is no chance of winning";
}

// Sample Inputs
const ourInput = "Spearmen#10;Militia#30;FootArcher#20;LightCavalry#1000;HeavyCavalry#120";
const enemyInput = "Militia#10;Spearmen#10;FootArcher#1000;LightCavalry#120;CavalryArcher#100";

const result = findWinningArrangement(ourInput, enemyInput);
console.log(result);
