var osc = new Tone.OmniOscillator();
osc.frequency.value = "C4";
osc.start().stop("+8n");
var env = new Tone.AmplitudeEnvelope();
osc.connect(env);
env.toMaster();
osc.start();
env.triggerAttack();