import { updateDocument } from "src/services/dynalist";
import getNodes, { type AugmentedNode } from "src/services/dynalist/getNodes";
import type { NodeEdit } from "src/services/dynalist/types";

function getEdit(node: AugmentedNode): NodeEdit | null {
  const matches = node.content.match(/#snooze=(\d{4}-\d{2}-\d{2})/);
  const hasSnooze = !!matches;
  const snoozeDate = hasSnooze && new Date(matches[1]);
  const isSnoozed = node.content.includes("#snoozed");
  const isDateFuture = hasSnooze && snoozeDate > new Date();
  const shouldSnooze = hasSnooze && !isSnoozed && isDateFuture;
  const shouldUnsnooze = hasSnooze && isSnoozed && !isDateFuture;

  if (shouldSnooze) {
    return {
      action: "edit",
      node_id: node.id,
      content: `${node.content} #snoozed`,
      checked: true,
    };
  }

  if (shouldUnsnooze) {
    return {
      action: "edit",
      node_id: node.id,
      content: node.content.replace(/#snoozed/, "").trim(),
      checked: false,
    };
  }

  return null;
}

export default async function dynaSnooze() {
  const nodes = await getNodes();

  const fileIds = [...new Set(nodes.map((node) => node.file_id))];

  const promises = fileIds.map(async (file_id) => {
    const changes: NodeEdit[] = nodes
      .filter((node) => node.file_id === file_id)
      .map(getEdit)
      .filter(Boolean) as NodeEdit[];

    if (changes.length === 0) {
      return;
    }

    await updateDocument({
      file_id,
      changes,
    });
  });

  await Promise.all(promises);
}
