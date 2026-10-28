<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

## Architecture
- Prototype is front-end only: all notebook data lives in `src/lib/pcdf-store.ts` (seed + localStorage); no backend, no external calls, by product requirement.
- The mock AI agent (`agentReply`) must always cite notebook analyses or reply that the info wasn't found — traceability is the core demo promise.
