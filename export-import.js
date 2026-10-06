
// Export/Import functionality for Naruto D&D Character Creator

const ExportImport = {
  // Export character data as JSON
  exportCharacter: function() {
    const character = this.collectCharacterData();
    const data = {
      version: '1.0',
      exportDate: new Date().toISOString(),
      character: character
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `naruto-dnd-character-${character.name.replace(/\s+/g, '-').toLowerCase()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  },

  // Collect all character data from the form
  collectCharacterData: function() {
    const data = {
      name: document.getElementById('f_name')?.value || '',
      level: document.getElementById('f_level')?.value || '',
      clan: document.getElementById('f_clan')?.value || '',
      ryo: document.getElementById('f_ryo')?.value || '',
      chakra: {
        current: document.getElementById('f_chakra_current')?.value || '',
        max: document.getElementById('f_chakra_max')?.value || ''
      },
      hp: {
        current: document.getElementById('f_hp_current')?.value || '',
        max: document.getElementById('f_hp_max')?.value || ''
      },
      abilities: {},
      jutsu: [],
      equipment: [],
      notes: document.getElementById('f_notes')?.value || ''
    };

    // Collect ability scores
    const abilities = ['str', 'dex', 'con', 'int', 'wis', 'cha'];
    abilities.forEach(ability => {
      const scoreEl = document.getElementById(`f_${ability}`);
      const modEl = document.getElementById(`f_${ability}_mod`);
      if (scoreEl) {
        data.abilities[ability] = {
          score: scoreEl.value || '',
          modifier: modEl?.value || ''
        };
      }
    });

    // Collect jutsu
    const jutsuItems = document.querySelectorAll('.jutsu-item');
    jutsuItems.forEach(item => {
      const name = item.querySelector('.jutsu-name')?.value || '';
      const description = item.querySelector('.jutsu-description')?.value || '';
      if (name) {
        data.jutsu.push({ name, description });
      }
    });

    // Collect equipment
    const equipmentItems = document.querySelectorAll('.equipment-item');
    equipmentItems.forEach(item => {
      const name = item.querySelector('.equipment-name')?.value || '';
      const description = item.querySelector('.equipment-description')?.value || '';
      if (name) {
        data.equipment.push({ name, description });
      }
    });

    return data;
  },

  // Import character data from JSON file
  importCharacter: function(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = function(e) {
        try {
          const data = JSON.parse(e.target.result);

          if (!data.version || !data.character) {
            throw new Error('Invalid character export file');
          }

          // Populate form with imported data
          const character = data.character;

          if (character.name) document.getElementById('f_name').value = character.name;
          if (character.level) document.getElementById('f_level').value = character.level;
          if (character.clan) document.getElementById('f_clan').value = character.clan;
          if (character.ryo) document.getElementById('f_ryo').value = character.ryo;

          // Import abilities
          if (character.abilities) {
            Object.keys(character.abilities).forEach(ability => {
              const scoreEl = document.getElementById(`f_${ability}`);
              const modEl = document.getElementById(`f_${ability}_mod`);
              if (scoreEl && character.abilities[ability].score) {
                scoreEl.value = character.abilities[ability].score;
              }
              if (modEl && character.abilities[ability].modifier) {
                modEl.value = character.abilities[ability].modifier;
              }
            });
          }

          // Import notes
          if (character.notes) {
            document.getElementById('f_notes').value = character.notes;
          }

          resolve({ success: true, message: 'Character imported successfully' });
        } catch (err) {
          reject(err);
        }
      };
      reader.onerror = function() {
        reject(new Error('Failed to read file'));
      };
      reader.readAsText(file);
    });
  }
};

// Make available globally
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ExportImport;
} else {
  window.ExportImport = ExportImport;
}
