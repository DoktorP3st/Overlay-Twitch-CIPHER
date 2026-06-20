# ⚡ CIPHER — Chat Overlay StreamElements

> Widget custom pour **StreamElements** — Chat Twitch sombre avec effets cyberpunk : scanline d'entrée, barres de signal, coins en L lumineux et glow néon sur chaque pseudo.

---

## ✨ Effets visuels

### Sur chaque message
- 📡 **Barres de signal** qui s'allument en cascade à l'entrée
- 🔍 **Scanline** qui balaie la carte de haut en bas
- 🔲 **Coins en L** dans la couleur du viewer
- 💡 **Glow néon** sur le pseudo (couleur Twitch de l'utilisateur)
- 🎨 **Fond teinté** subtilement dans la couleur du viewer

### Animations
- Entrée : glissement depuis la gauche avec rebond élastique
- Sortie : fondu + léger slide
- Flash **glitch** si quelqu'un mentionne le streamer

---

## 🎨 Hiérarchie des badges

| Badge | Couleur accent |
|-------|----------------|
| 👑 Broadcaster | Rouge `#ff3838` |
| 🔨 Modérateur | Vert cyan `#0be8a8` |
| 💎 VIP | Orange `#ee5a24` |
| ⭐ Abonné | Violet subtil |
| 👁️ Viewer | Couleur Twitch du pseudo |

---

## 🎛️ Paramètres configurables (panel SE)

| Paramètre | Description | Défaut |
|-----------|-------------|--------|
| `chatWidth` | Largeur du widget (px) | 400 |
| `maxMessages` | Max messages affichés | 8 |
| `lifetime` | Durée de vie des messages (sec, 0=∞) | 25 |
| `fontSize` | Taille du texte (px) | 14 |
| `usernameFontSize` | Taille des pseudos (px) | 12 |
| `animIn` | Durée animation entrée (ms) | 380 |
| `cardColor` | Couleur fond des cartes | `#06040f` |
| `cardOpacity` | Opacité des cartes (0–100) | 92 |
| `textColor` | Couleur du texte | `#c0bcd8` |
| `mentionAliases` | Pseudos à surveiller (flash glitch) | DoktorP3st, Paglorieux |
| `showTimestamp` | Afficher l'heure | Non |
| `showBadges` | Afficher les badges | Oui |
| `hideBots` | Masquer les bots connus | Oui |
| `hideCommands` | Masquer les commandes `!` | Non |

---

## 🧪 Test

Dans le panel **FIELDS** de SE :

| Bouton | Action |
|--------|--------|
| **Envoyer un message test** | Envoie un faux message d'un viewer aléatoire |
| **Effacer tous les messages** | Vide le chat |

---

## 📦 Installation

1. Sur **StreamElements**, créer un nouveau **Custom Widget**
2. Coller le contenu de chaque fichier dans l'onglet correspondant :
   - `CIPHER.html` → onglet **HTML**
   - `CIPHER.css` → onglet **CSS**
   - `CIPHER.js` → onglet **JS**
   - `CIPHER.json` → onglet **FIELDS**
3. Sauvegarder et ajouter la source dans **OBS**
4. Positionner et redimensionner dans OBS selon ta mise en page

> `CIPHER-test.html` — fichier de test local, ouvre directement dans le navigateur pour prévisualiser sans OBS.

---

## 🔗 Liens

- 🎮 Twitch : [twitch.tv/DoktorP3st](https://twitch.tv/DoktorP3st)
