import * as React from "react";
import * as Sarif from "sarif";
import * as Keys from "./result-keys";
import { SarifLocation } from "./locations/SarifLocation";
import { selectableZebraStripe, openFile } from "./result-table-utils";
import { useCallback, useMemo } from "react";
import { MadFileLocation } from "../../common/interface-types";
import { styled } from "styled-components";
import TextButton from "../common/TextButton";

const Link = styled(TextButton)`
  text-decoration: none;
`;

interface Props {
  step: Sarif.ThreadFlowLocation;
  pathNodeIndex: number;
  pathIndex: number;
  resultIndex: number;
  selectedItem: undefined | Keys.ResultKey;
  selectedItemRef: React.RefObject<any>;
  databaseUri: string;
  sourceLocationPrefix: string;
  updateSelectionCallback: (
    resultKey: Keys.PathNode | Keys.Result | undefined,
  ) => void;
  madData: Record<string, MadFileLocation[]>;
}

export function AlertTablePathNodeRow(props: Props) {
  const {
    step,
    pathNodeIndex,
    pathIndex,
    resultIndex,
    selectedItem,
    selectedItemRef,
    databaseUri,
    sourceLocationPrefix,
    updateSelectionCallback,
    madData,
  } = props;

  const pathNodeKey: Keys.PathNode = useMemo(
    () => ({
      resultIndex,
      pathIndex,
      pathNodeIndex,
    }),
    [pathIndex, pathNodeIndex, resultIndex],
  );
  const handleSarifLocationClicked = useCallback(
    () => updateSelectionCallback(pathNodeKey),
    [pathNodeKey, updateSelectionCallback],
  );

  const isSelected = Keys.equalsNotUndefined(selectedItem, pathNodeKey);
  const stepIndex = pathNodeIndex + 1; // Convert to 1-based
  const zebraIndex = resultIndex + stepIndex;
  const madHash = step.properties ? step.properties["mad.hash"] : undefined;
  const madLocations = madData[madHash];
  // TODO: how to display multiple locations?
  const madLocation = madLocations ? madLocations[0] : undefined;
  const handleMadClick = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (!madLocation) {
        return;
      }
      openFile(madLocation?.path);
    },
    [madLocation],
  );

  return (
    <tr
      ref={isSelected ? selectedItemRef : undefined}
      className={isSelected ? "vscode-codeql__selected-path-node" : undefined}
    >
      <td className="vscode-codeql__icon-cell">
        <span className="vscode-codeql__vertical-rule"></span>
      </td>
      <td className="vscode-codeql__icon-cell">
        <span className="vscode-codeql__vertical-rule"></span>
      </td>
      <td
        {...selectableZebraStripe(
          isSelected,
          zebraIndex,
          "vscode-codeql__path-index-cell",
        )}
      >
        {stepIndex}
      </td>
      <td {...selectableZebraStripe(isSelected, zebraIndex)}>
        {step.location && step.location.message ? (
          <SarifLocation
            text={step.location.message.text}
            loc={step.location}
            sourceLocationPrefix={sourceLocationPrefix}
            databaseUri={databaseUri}
            onClick={handleSarifLocationClicked}
          />
        ) : (
          "[no location]"
        )}
      </td>
      <td
        {...selectableZebraStripe(
          isSelected,
          zebraIndex,
          "vscode-codeql__location-cell",
        )}
      >
        {step.location && (
          <SarifLocation
            loc={step.location}
            sourceLocationPrefix={sourceLocationPrefix}
            databaseUri={databaseUri}
            onClick={handleSarifLocationClicked}
          />
        )}
      </td>
      <td {...selectableZebraStripe(isSelected, zebraIndex)}>
        {madLocation && <Link onClick={handleMadClick}>MAD</Link>}
      </td>
    </tr>
  );
}
