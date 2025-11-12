# Elaboration phase (3/4)

We are now in elaboration phase. Look into the "BACKLOG.md" document – focus on Sprints in status `Progress`.

Document the design. Create required diagrams, and class/data modeles to clarify furture implemenmtnation. Once completed, wait for review and further instructions.

## Progress board

When the inception phase is started mark it by setting Sprint's status to `under_design` in the `PROGRESS_BOARD.md` file. Note it's allowed extension of general project rules.

Progress board is a table showing sprint, and backlog items state. It's the only purpose of this file. All potential comments, progress notes, etc. always keep in dedicated files for each phase.

When the inception if the Backlog Item belonging to the Sprint is started mark it by setting Backlog Item's status to `under_design` in the Sprint's chapter of the `PROGRESS_BOARD.md` file. Note it's allowed extension of general project rules.

When the analysis is completed - mark Backlog Item as `designed` in the Sprint's chapter `PROGRESS_BOARD.md` file. Note it's allowed extension of general project rules.

Save the elaboration product in `progress/sprint_${no}/sprint_${no}_design.md`

## Any questions?

If anything is not clear raise it now, and stop here.

## Ready to go?

If all is clear, procedd with design.

## Finalization

Once all Backlog Items for the Sprint are designed, and all potential clarifications and sicussions are concluded, confirm completion of the design, and summarize the session in `progress/elaboration/elaboration_sprint_${no}_chat_${cnt}.md`, where `cnt` is the sequence number of the review file; look into the directory for recent elaboration review file to deduct next cnt value. In the summarization refer to design document and add things that shouws design process.

Commit the Sprint related changes to the repository following semantic commit message convention. Do not change any other documents / file in the local file system! Push to remote after commit.
