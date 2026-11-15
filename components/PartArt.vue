<script setup lang="ts">
withDefaults(
  defineProps<{
    kind?: string;
    label?: string;
  }>(),
  { kind: 'filter', label: 'تصویر قطعه' },
);
</script>

<template>
  <svg class="part-art" viewBox="0 0 240 200" fill="none" role="img" :aria-label="label">
    <g v-if="kind === 'disc'" stroke-linecap="round">
      <circle cx="120" cy="100" r="64" fill="rgba(255,59,47,0.07)" stroke="#ff5a44" stroke-width="3" />
      <circle cx="120" cy="100" r="44" stroke="#8fa0b4" stroke-width="1.6" stroke-dasharray="4 7" />
      <circle cx="120" cy="100" r="19" fill="#0c1015" stroke="#ff5a44" stroke-width="3" />
      <circle cx="120" cy="100" r="7" fill="#ff5a44" />
      <g fill="#0c1015" stroke="#8fa0b4" stroke-width="2.4">
        <circle cx="120" cy="66" r="6" />
        <circle cx="152" cy="88" r="6" />
        <circle cx="140" cy="126" r="6" />
        <circle cx="100" cy="126" r="6" />
        <circle cx="88" cy="88" r="6" />
      </g>
      <path d="M186 78a70 70 0 0 1 4 44" stroke="#ffb020" stroke-width="5" />
    </g>

    <g v-else-if="kind === 'pad'" stroke-linecap="round">
      <path
        d="M54 68h132a10 10 0 0 1 10 10v44a10 10 0 0 1-10 10H54a10 10 0 0 1-10-10V78a10 10 0 0 1 10-10z"
        fill="rgba(255,59,47,0.08)" stroke="#ff5a44" stroke-width="3"
      />
      <path d="M62 86h116" stroke="#8fa0b4" stroke-width="2.4" />
      <path d="M62 114h116" stroke="#8fa0b4" stroke-width="2.4" />
      <path d="M62 100h116" stroke="#ff5a44" stroke-width="3" stroke-dasharray="9 8" />
      <rect x="34" y="80" width="14" height="40" rx="5" fill="#0c1015" stroke="#8fa0b4" stroke-width="2.4" />
      <rect x="192" y="80" width="14" height="40" rx="5" fill="#0c1015" stroke="#8fa0b4" stroke-width="2.4" />
    </g>

    <g v-else-if="kind === 'filter'" stroke-linecap="round">
      <rect x="82" y="48" width="76" height="106" rx="14" fill="rgba(255,59,47,0.08)" stroke="#ff5a44" stroke-width="3" />
      <path d="M82 66h76" stroke="#8fa0b4" stroke-width="2.4" />
      <path d="M82 138h76" stroke="#8fa0b4" stroke-width="2.4" />
      <path d="M96 78v46M108 78v46M120 78v46M132 78v46M144 78v46" stroke="#6d7a8b" stroke-width="1.8" />
      <path d="M104 154v14a16 16 0 0 0 32 0v-14" stroke="#ffb020" stroke-width="3" />
    </g>

    <g v-else-if="kind === 'plug'" stroke-linecap="round">
      <rect x="102" y="30" width="36" height="30" rx="5" fill="rgba(255,176,32,0.1)" stroke="#ffb020" stroke-width="2.6" />
      <path d="M100 64h40l-4 26h-32z" fill="#10151b" stroke="#8fa0b4" stroke-width="2.6" />
      <path d="M104 96h32v46h-32z" fill="rgba(255,59,47,0.08)" stroke="#ff5a44" stroke-width="2.8" />
      <path d="M104 106h32M104 118h32M104 130h32M104 142h32" stroke="#6d7a8b" stroke-width="1.8" />
      <path d="M112 146v14a8 8 0 0 0 16 0v-14" stroke="#8fa0b4" stroke-width="2.4" />
      <path d="M120 160v12" stroke="#ff5a44" stroke-width="3" />
    </g>

    <g v-else-if="kind === 'light'" stroke-linecap="round">
      <path
        d="M62 106c-6-34 14-60 52-62 34-2 56 16 62 42 4 20-4 34-18 40-26 11-70 12-96-20z"
        fill="rgba(255,176,32,0.08)" stroke="#ff5a44" stroke-width="3"
      />
      <ellipse cx="112" cy="100" rx="30" ry="26" fill="rgba(255,255,255,0.05)" stroke="#ffb020" stroke-width="2.4" />
      <path d="M100 100h24M112 88v24" stroke="#ffb020" stroke-width="2.6" />
      <path d="M38 88l-14-8M36 108h-18M42 126l-14 8" stroke="#8fa0b4" stroke-width="2.6" />
    </g>

    <g v-else-if="kind === 'battery'" stroke-linecap="round">
      <rect x="52" y="60" width="136" height="86" rx="10" fill="rgba(255,59,47,0.07)" stroke="#ff5a44" stroke-width="3" />
      <rect x="70" y="48" width="26" height="14" rx="4" fill="#0c1015" stroke="#8fa0b4" stroke-width="2.4" />
      <rect x="144" y="48" width="26" height="14" rx="4" fill="#0c1015" stroke="#ff5a44" stroke-width="2.4" />
      <path d="M52 78h136" stroke="#8fa0b4" stroke-width="2" />
      <path d="M112 90l-14 22h18l-8 20 26-28h-18l10-14z" fill="#ffb020" opacity="0.85" />
      <path d="M70 128h100" stroke="#6d7a8b" stroke-width="1.8" />
    </g>

    <g v-else-if="kind === 'radiator'" stroke-linecap="round">
      <rect x="54" y="46" width="132" height="108" rx="8" fill="rgba(255,59,47,0.06)" stroke="#ff5a44" stroke-width="3" />
      <rect x="54" y="46" width="132" height="16" rx="6" fill="#0c1015" stroke="#8fa0b4" stroke-width="2.2" />
      <rect x="54" y="138" width="132" height="16" rx="6" fill="#0c1015" stroke="#8fa0b4" stroke-width="2.2" />
      <path
        d="M70 68v64M82 68v64M94 68v64M106 68v64M118 68v64M130 68v64M142 68v64M154 68v64M166 68v64"
        stroke="#6d7a8b" stroke-width="2"
      />
      <path d="M186 54h18v30" stroke="#ffb020" stroke-width="3" />
    </g>

    <g v-else-if="kind === 'shock'" stroke-linecap="round">
      <path d="M120 28v34" stroke="#8fa0b4" stroke-width="5" />
      <path d="M104 62h32v18h-32z" fill="#10151b" stroke="#ff5a44" stroke-width="2.6" />
      <path
        d="M104 80l32 10-32 10 32 10-32 10 32 10-32 10 32 10"
        stroke="#ffb020" stroke-width="3"
      />
      <rect x="108" y="150" width="24" height="26" rx="5" fill="#0c1015" stroke="#ff5a44" stroke-width="2.8" />
      <path d="M120 72v82" stroke="#6d7a8b" stroke-width="4" />
    </g>

    <g v-else-if="kind === 'belt'" stroke-linecap="round">
      <ellipse cx="120" cy="100" rx="66" ry="40" fill="none" stroke="#ff5a44" stroke-width="3" />
      <ellipse cx="120" cy="100" rx="52" ry="27" fill="none" stroke="#8fa0b4" stroke-width="2" stroke-dasharray="7 6" />
      <g fill="#10151b" stroke="#ffb020" stroke-width="2">
        <circle cx="66" cy="100" r="13" />
        <circle cx="174" cy="100" r="10" />
      </g>
      <path d="M96 72l10 10M132 74l-8 10" stroke="#6d7a8b" stroke-width="2" />
    </g>

    <g v-else-if="kind === 'clutch'" stroke-linecap="round">
      <circle cx="120" cy="100" r="58" fill="rgba(255,59,47,0.07)" stroke="#ff5a44" stroke-width="3" />
      <circle cx="120" cy="100" r="34" stroke="#8fa0b4" stroke-width="2" stroke-dasharray="5 5" />
      <circle cx="120" cy="100" r="15" fill="#0c1015" stroke="#ffb020" stroke-width="2.6" />
      <path
        d="M120 85v-13M120 115v13M105 100h-13M135 100h13M109 89l-9-9M131 111l9 9M131 89l9-9M109 111l-9 9"
        stroke="#ffb020" stroke-width="2.4"
      />
    </g>

    <g v-else-if="kind === 'mirror'" stroke-linecap="round">
      <path
        d="M70 56h72a22 22 0 0 1 22 22v34a22 22 0 0 1-22 22H70a12 12 0 0 1-12-12V68a12 12 0 0 1 12-12z"
        fill="rgba(74,168,255,0.07)" stroke="#ff5a44" stroke-width="3"
      />
      <path d="M76 70h58a14 14 0 0 1 14 14v24a14 14 0 0 1-14 14H76z" fill="rgba(143,160,180,0.14)" stroke="#8fa0b4" stroke-width="2" />
      <path d="M170 84h16a10 10 0 0 1 10 10v14a10 10 0 0 1-10 10h-16" stroke="#ffb020" stroke-width="3" />
      <path d="M58 146h60" stroke="#6d7a8b" stroke-width="2.4" />
    </g>

    <g v-else-if="kind === 'bumper'" stroke-linecap="round">
      <path
        d="M28 120c0-30 30-48 92-50 62 2 92 20 92 50l-14 26H42z"
        fill="rgba(255,59,47,0.07)" stroke="#ff5a44" stroke-width="3"
      />
      <path d="M44 118h152" stroke="#8fa0b4" stroke-width="2.4" />
      <rect x="62" y="106" width="30" height="18" rx="6" fill="#0c1015" stroke="#ffb020" stroke-width="2.4" />
      <rect x="148" y="106" width="30" height="18" rx="6" fill="#0c1015" stroke="#ffb020" stroke-width="2.4" />
      <path d="M96 112h48" stroke="#6d7a8b" stroke-width="2.4" />
    </g>

    <g v-else-if="kind === 'fluid'" stroke-linecap="round">
      <path d="M98 34h44v18l16 22v92H82V74l16-22z" fill="rgba(255,176,32,0.08)" stroke="#ff5a44" stroke-width="3" />
      <rect x="96" y="22" width="48" height="14" rx="5" fill="#0c1015" stroke="#8fa0b4" stroke-width="2.4" />
      <rect x="82" y="98" width="76" height="34" fill="rgba(255,255,255,0.05)" stroke="#8fa0b4" stroke-width="2" />
      <path d="M110 112h14M117 106v12" stroke="#ffb020" stroke-width="2.6" />
      <path d="M174 62c10 14 16 22 16 30a16 16 0 0 1-32 0c0-8 6-16 16-30z" fill="rgba(74,168,255,0.15)" stroke="#4aa8ff" stroke-width="2.4" />
    </g>

    <g v-else-if="kind === 'sensor'" stroke-linecap="round">
      <rect x="92" y="60" width="40" height="66" rx="8" fill="rgba(255,59,47,0.08)" stroke="#ff5a44" stroke-width="2.8" />
      <path d="M92 72h40M92 84h40M92 96h40M92 108h40" stroke="#6d7a8b" stroke-width="1.8" />
      <path d="M112 126v18" stroke="#8fa0b4" stroke-width="4" />
      <path d="M132 78c30 0 42 12 42 34v20" stroke="#ffb020" stroke-width="2.6" />
      <rect x="164" y="132" width="20" height="14" rx="4" fill="#0c1015" stroke="#ffb020" stroke-width="2.2" />
    </g>

    <g v-else-if="kind === 'pump'" stroke-linecap="round">
      <circle cx="118" cy="100" r="52" fill="rgba(255,59,47,0.07)" stroke="#ff5a44" stroke-width="3" />
      <circle cx="118" cy="100" r="16" fill="#0c1015" stroke="#ffb020" stroke-width="2.6" />
      <path
        d="M118 84c14-16 30-14 30 2 0 10-12 14-22 16M132 104c18 6 22 22 8 28-10 4-18-6-22-16M104 116c-16 8-30 2-26-12 3-10 14-10 24-12M96 92c-12-12-8-26 6-24 10 2 12 12 16 22"
        stroke="#8fa0b4" stroke-width="2.4"
      />
      <path d="M170 86h22v28h-22" stroke="#ff5a44" stroke-width="3" />
    </g>

    <g v-else-if="kind === 'engine'" stroke-linecap="round">
      <path d="M64 76h112v78H64z" fill="rgba(255,59,47,0.07)" stroke="#ff5a44" stroke-width="3" />
      <path d="M76 60h88v16H76z" fill="#10151b" stroke="#8fa0b4" stroke-width="2.4" />
      <circle cx="90" cy="68" r="5" fill="#ffb020" />
      <circle cx="110" cy="68" r="5" fill="#ffb020" />
      <circle cx="130" cy="68" r="5" fill="#ffb020" />
      <circle cx="150" cy="68" r="5" fill="#ffb020" />
      <path d="M64 96h-16v24h16M176 96h16v24h-16" stroke="#8fa0b4" stroke-width="2.6" />
      <path d="M86 110h68M86 126h68" stroke="#6d7a8b" stroke-width="2" />
    </g>

    <g v-else stroke-linecap="round">
      <rect x="82" y="48" width="76" height="106" rx="14" fill="rgba(255,59,47,0.08)" stroke="#ff5a44" stroke-width="3" />
      <path d="M82 66h76M82 138h76" stroke="#8fa0b4" stroke-width="2.4" />
      <path d="M104 154v14a16 16 0 0 0 32 0v-14" stroke="#ffb020" stroke-width="3" />
    </g>
  </svg>
</template>

<style scoped>
.part-art {
  width: 100%;
  height: 100%;
  filter: drop-shadow(0 18px 26px rgba(255, 59, 47, 0.14));
}
</style>
