//a polysynth composed of 6 Voices of Synth
var synth = new Tone.PolySynth(6, Tone.Synth, {
    oscillator : {
          type : "sine"
      }
  }).toMaster();
  //set the attributes using the set interface
  synth.set("detune", -1200);
  //play a chord
  synth.triggerAttackRelease(["C4", "E4", "A4"], "4n");

//attach a listener to the keyboard events
document.querySelector('tone-keyboard').addEventListener('noteon', e => {
  synth.triggerAttack(e.detail.name)
})

document.querySelector('tone-keyboard').addEventListener('noteoff', e => {
  synth.triggerRelease()
})