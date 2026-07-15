# Mermaid Dark Theme — full example

The flowchart reference this skill is modeled on. Every category color and the dotted
"planned/future" edge convention is exercised here. Other Mermaid diagram grammars keep
the init theme but must use their own supported styling syntax rather than copying these
flowchart `classDef` statements.

```mermaid
%%{init: {"theme": "base", "themeVariables": {"background": "#171717", "primaryColor": "#232323", "primaryTextColor": "#f5f5f5", "primaryBorderColor": "#d0d0d0", "lineColor": "#cfcfcf", "fontFamily": "Inter, Arial, sans-serif"}}}%%
flowchart TD
  A["Lead Sheet Input<br/>MusicXML / demo fixture"]
  B["Future Import Pipeline<br/>chord text<br/>full score / MIDI"]
  C["Analysis<br/>key + tempo + time<br/>chord summary"]
  D["Tension Suggestions<br/>major / minor<br/>dominant / half-dim"]
  E["Solo Arranger<br/>level + style + mode"]
  F["Voicing Strategy<br/>roots / shells<br/>block / rootless / drop-2"]
  G["Groove Pattern<br/>ballad / swing<br/>blues / shuffle"]
  H["Future Reharmonization<br/>Mode A rules"]
  I["Decision Log<br/>rationale + tags<br/>practice tips"]
  J["Render Outputs<br/>MusicXML + MIDI<br/>annotations"]
  K["Optional Verovio Render<br/>SVG / PDF when supported"]
  L["Web UI<br/>OSMD preview<br/>Tone.js playback"]

  A --> C
  B -. "planned import" .-> C
  C --> D
  D --> E
  E --> F
  E --> G
  E -. "future" .-> H
  F --> I
  G --> I
  H -. "reharm decisions" .-> I
  I --> J
  J --> K
  J --> L
  L -. "upload + preview loop" .-> A

  classDef input fill:#232323,stroke:#d0d0d0,color:#f5f5f5,stroke-width:2px;
  classDef planned fill:#3b2f20,stroke:#d0d0d0,color:#f5f5f5,stroke-width:2px,stroke-dasharray:5 5;
  classDef analysis fill:#52676b,stroke:#d0d0d0,color:#f5f5f5,stroke-width:2px;
  classDef arranger fill:#1b070a,stroke:#d0d0d0,color:#f5f5f5,stroke-width:2px;
  classDef music fill:#62164d,stroke:#d0d0d0,color:#f5f5f5,stroke-width:2px;
  classDef evidence fill:#173f32,stroke:#d0d0d0,color:#f5f5f5,stroke-width:2px;
  classDef render fill:#5a3520,stroke:#d0d0d0,color:#f5f5f5,stroke-width:2px;
  class A input;
  class B,H planned;
  class C,D analysis;
  class E arranger;
  class F,G music;
  class I evidence;
  class J,K,L render;
```

Note: `arranger` here is the same hex as `accent` in SKILL.md (`#1b070a`) — rename the
class to fit the domain, keep the hex so the palette stays consistent.
