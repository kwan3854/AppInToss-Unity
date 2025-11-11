using System;
using System.Threading;
using Ait;
using Cysharp.Threading.Tasks;
using Cysharp.Threading.Tasks.Linq;

namespace AIT.AIT_SDK.ExtensionMethods
{
    public static class AdServiceClientExtensions
    {
        /// <summary>
        /// Loads an ad and polls for load events, returning them as an async stream.
        /// Throws an exception if the LoadAd operation fails to start.
        /// </summary>
        public static IUniTaskAsyncEnumerable<LoadAdEvent> LoadAdAsStream(this AdServiceClient client, LoadAdRequest request, CancellationToken cancellationToken = default)
        {
            return UniTaskAsyncEnumerable.Create<LoadAdEvent>(async (writer, token) =>
            {
                var loadAdResponse = await client.LoadAd(request);
                var operationId = loadAdResponse.OperationId;

                if (string.IsNullOrEmpty(operationId))
                {
                    throw new Exception("Failed to start LoadAd operation. Ad service might not be supported or ad_group_id is invalid.");
                }

                var isFinished = false;
                while (!isFinished && !token.IsCancellationRequested)
                {
                    var pollResponse = await client.PollLoadAdEvents(new PollLoadAdEventsRequest { OperationId = operationId });
                    isFinished = pollResponse.IsFinished;

                    foreach (var ev in pollResponse.Events)
                    {
                        await writer.YieldAsync(ev);
                    }

                    if (!isFinished)
                    {
                        await UniTask.Delay(TimeSpan.FromMilliseconds(500), cancellationToken: token);
                    }
                }
            });
        }

        /// <summary>
        /// Shows an ad and polls for show events, returning them as an async stream.
        /// Throws an exception if the ShowAd operation fails to start.
        /// </summary>
        public static IUniTaskAsyncEnumerable<ShowAdEvent> ShowAdAsStream(this AdServiceClient client, ShowAdRequest request, CancellationToken cancellationToken = default)
        {
            return UniTaskAsyncEnumerable.Create<ShowAdEvent>(async (writer, token) =>
            {
                var showAdResponse = await client.ShowAd(request);
                var operationId = showAdResponse.OperationId;

                if (string.IsNullOrEmpty(operationId))
                {
                    throw new Exception("Failed to start ShowAd operation. Ad service might not be supported or ad_group_id is invalid.");
                }

                var isFinished = false;
                while (!isFinished && !token.IsCancellationRequested)
                {
                    var pollResponse = await client.PollShowAdEvents(new PollShowAdEventsRequest { OperationId = operationId });
                    isFinished = pollResponse.IsFinished;

                    foreach (var ev in pollResponse.Events)
                    {
                        await writer.YieldAsync(ev);
                    }

                    if (!isFinished)
                    {
                        await UniTask.Delay(TimeSpan.FromMilliseconds(500), cancellationToken: token);
                    }
                }
            });
        }
    }
}