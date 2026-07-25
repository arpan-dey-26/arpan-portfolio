// Sourced from MASTER_PORTFOLIO_DATA.md → PERSONAL INFORMATION.
//
// `name`: full "Arpan Dey" here (a hiring-focused Hero should show the
// complete real name), distinct from the shorter "Arpan" used as the
// casual brand mark elsewhere (Navbar logo, "Ask Arpan AI") — both are
// real, they just serve different contexts.
//
// `role`: the full professional headline, given as one pipe-separated
// string. Left intact rather than split across `role`/`valueProposition`
// — deciding which words are the "role" and which are the "value
// proposition" is a copywriting/design decision for when Hero is actually
// built, not a data-entry one.
export const heroCopy = {
  name: 'Arpan Dey',
  role: 'Software Engineer | Java Developer | AI & Full-Stack Developer | Building Intelligent Digital Solutions',
  valueProposition: '', // TODO: consider splitting out of `role` above when Hero is designed
};
