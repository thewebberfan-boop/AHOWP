"use client";

import type { ReactNode } from "react";
import { problemRelationNotes, type ProblemNodeKind, type ProblemRelationKind } from "./problem-map-data";
import { problemCompressionLevels, problemFacetOptions, type ProblemCompressionLevel } from "./problem-map-self-data";
import { readingTopicIds, type ReadingTopicId } from "./reading-topics-data";

export const kindEnglish: Record<ProblemNodeKind, string> = {
  观察: "OBSERVATION",
  问题: "QUESTION",
  答案: "ANSWER",
};

const relationEnglish: Record<ProblemRelationKind, string> = {
  提出问题: "RAISES",
  回应问题: "ANSWERS",
  产生问题: "GENERATES",
};

export function ProblemGraphControls({
  selectedTopicIds,
  availableTopicIds = readingTopicIds,
  compressionLevel,
  onToggleTopic,
  onClearTopics,
  onCompressionChange,
  onCompressionBack,
  compressionBackDisabled = false,
  compressionBackLabel = "返回上一层",
  fullLabel = "全图",
  topicCountForLabel = selectedTopicIds.length,
  mode = "topic",
  children,
  className = "",
}: {
  selectedTopicIds: readonly ReadingTopicId[];
  availableTopicIds?: readonly ReadingTopicId[];
  compressionLevel?: ProblemCompressionLevel;
  onToggleTopic: (topic: ReadingTopicId) => void;
  onClearTopics: () => void;
  onCompressionChange?: (level: ProblemCompressionLevel) => void;
  onCompressionBack?: () => void;
  compressionBackDisabled?: boolean;
  compressionBackLabel?: string;
  fullLabel?: string;
  topicCountForLabel?: number;
  mode?: "topic" | "full";
  children?: ReactNode;
  className?: string;
}) {
  const availableTopics = new Set(availableTopicIds);
  const showCompression = mode === "topic" && compressionLevel && onCompressionChange;

  return <section className={`problem-map-controls${className ? ` ${className}` : ""}`} aria-label="图谱阅读控制与图例">
    <div className={`problem-control-main ${mode === "topic" ? "topic-mode" : "full-mode"}`}>
      <div className="problem-facet-controls" role="group" aria-label="主题筛选，可多选">
        <span><small>01</small>阅读主题</span>
        <button type="button" className={selectedTopicIds.length === 0 ? "active" : ""} aria-pressed={selectedTopicIds.length === 0} onClick={onClearTopics}>{fullLabel}</button>
        {problemFacetOptions.map((option) => {
          const available = option.available && availableTopics.has(option.id);
          return <button type="button" className={selectedTopicIds.includes(option.id) ? "active" : ""} aria-pressed={selectedTopicIds.includes(option.id)} disabled={!available} title={available ? option.question : `${option.label}主题与本页没有已整理的关联节点`} onClick={() => onToggleTopic(option.id)} key={option.id}>{option.label}</button>;
        })}
      </div>
      {showCompression && <div className="problem-compression-controls" role="group" aria-label="主题总结层级">
        <span><small>02</small>{topicCountForLabel > 1 ? "并列层级" : "阅读层级"}</span>
        {problemCompressionLevels.map((option) => <button type="button" className={compressionLevel === option.id ? "active" : ""} aria-pressed={compressionLevel === option.id} title={option.note} onClick={() => onCompressionChange(option.id)} key={option.id}>{option.label}</button>)}
        <button type="button" className="problem-compression-back" disabled={compressionBackDisabled} aria-label={compressionBackLabel} title={compressionBackLabel} onClick={onCompressionBack}><span aria-hidden="true">←</span></button>
      </div>}
      {children}
    </div>
    <div className="problem-control-reference" aria-label="图谱图例">
      <div className="problem-control-legend" aria-label="节点类型">
        <span className="problem-control-label">节点</span>
        {(Object.keys(kindEnglish) as ProblemNodeKind[]).map((kind) => <span className={`problem-control-token kind-${kind}`} data-tooltip={`${kindEnglish[kind]}：${kind === "观察" ? "记录使问题出现的经验、实践或历史条件。" : kind === "问题" ? "明确尚待回答的解释压力。" : "对问题提出的区分、反驳、修复或综合。"}`} key={kind}><i aria-hidden="true" />{kind}</span>)}
      </div>
      <div className="problem-control-legend" aria-label="关系类型">
        <span className="problem-control-label">箭头</span>
        {(Object.keys(problemRelationNotes) as ProblemRelationKind[]).map((relation) => <span className="problem-control-token relation" data-tooltip={`${relationEnglish[relation]}：${problemRelationNotes[relation]}`} key={relation}><i aria-hidden="true" />{relation}</span>)}
      </div>
    </div>
  </section>;
}
