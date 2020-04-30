import "foundry-pc-types";
import * as data from "../template.json";

type Template = typeof data;

type FitDActorTemplate = Template["Actor"]["templates"]["scumAndVillainy"];

interface FitDActorData extends ActorData, FitDActorTemplate {}

interface FitDActorSheetData extends ActorSheetData {
  data: FitDActorData;
}
